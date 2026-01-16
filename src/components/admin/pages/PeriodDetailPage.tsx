import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PeriodHeader from "../period-detail/PeriodHeader";
import PeriodStatusActions from "../period-detail/PeriodStatusActions";
import ExportActions from "../period-detail/ExportActions";
import PeriodKpis from "../period-detail/PeriodKpis";
import StudentsFilters from "../period-detail/StudentsFilters";
import StudentsTable from "../period-detail/StudentsTable";
import StudentsPagination from "../period-detail/StudentsPagination";
import ImportStudentsModal from "../ImportStudentsModal";
import StateCard from "../../common/StateCard";

import { apiDownload } from "../../../lib/api";

import {
  formatDate,
  progressPct,
  safeFileName,
  statusLabel,
  statusPillClass,
  TOTAL_QUESTIONS,
  toUiError,
  type UiError,
} from "../../../utils/utils";

import { useAdminPeriodSummary } from "../../../features/admin/period/useAdminPeriodSummary";
import { useAdminPeriodStudents } from "../../../features/admin/period/useAdminPeriodStudents";
import { useUpdatePeriodStatus } from "../../../features/admin/period/useUpdatePeriodStatus";

function badgeStatus(status: string) {
  const s = (status || "").toLowerCase();
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";
  if (s === "active") return `${base} bg-emerald-100 text-emerald-800`;
  if (s === "closed") return `${base} bg-slate-100 text-slate-700`;
  if (s === "draft") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-slate-100 text-slate-700`;
}

export default function PeriodDetailPage() {
  const { id } = useParams<{ id: string }>();

  const parsedId = Number(id);
  const isValidId = Number.isFinite(parsedId) && parsedId > 0;
  const periodId = isValidId ? parsedId : 0;

  // UI state
  const [uiErr, setUiErr] = useState<UiError | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [exporting, setExporting] = useState<null | "csv" | "pdf">(null);

  // Filters/pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<
    "" | "not_started" | "in_progress" | "finished"
  >("");
  const [course, setCourse] = useState("");

  // Data hooks (si periodId=0, los hooks deben tener enabled interno y NO fetchear)
  const summaryQ = useAdminPeriodSummary(periodId);
  const studentsQ = useAdminPeriodStudents(periodId, {
    page,
    pageSize,
    q,
    status,
    course,
  });

  // Mutation
  const updateStatus = useUpdatePeriodStatus(periodId);
  const mutating =
    updateStatus.isPending && updateStatus.variables
      ? updateStatus.variables === "active"
        ? "activate"
        : "close"
      : null;

  // Map errors to UiError (sin setState en render)
  useEffect(() => {
    const anyError = summaryQ.error || studentsQ.error;
    if (anyError) setUiErr(toUiError(anyError));
    else setUiErr(null);
  }, [summaryQ.error, studentsQ.error]);

  // ✅ Derivados SIEMPRE calculados (sin returns antes de useMemo)
  const summary = summaryQ.data;
  const rows = studentsQ.data?.rows ?? [];
  const total = studentsQ.data?.total ?? 0;
  const courses = studentsQ.data?.courses ?? [];

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  function onApplyFilters() {
    setPage(1);
  }

  function goPage(next: number) {
    const clamped = Math.min(Math.max(next, 1), totalPages);
    setPage(clamped);
  }

  // ✅ A partir de aquí recién decides qué mostrar
  if (!isValidId) {
    return (
      <StateCard
        backHref="/admin/periods"
        backLabel="Volver a periodos"
        title="URL inválida"
        message="El ID del periodo no es válido."
      />
    );
  }

  if (summaryQ.isLoading) {
    return (
      <div className="card">
        <p className="text-sm text-muted">Cargando…</p>
      </div>
    );
  }

  if (uiErr) {
    return (
      <StateCard
        backHref="/admin/periods"
        backLabel="Volver a periodos"
        title={uiErr.title}
        message={uiErr.message}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Link
        to="/admin/periods"
        className="text-sm text-slate-600 hover:underline">
        ← Volver a periodos
      </Link>

      <PeriodHeader
        pid={parsedId}
        name={summary?.period?.name}
        status={summary?.period?.status}
        startAt={summary?.period?.startAt}
        endAt={summary?.period?.endAt}
        createdAt={summary?.period?.createdAt}
        badgeStatus={badgeStatus}
        formatDate={formatDate}
      />

      <PeriodStatusActions
        status={summary?.period?.status}
        mutating={mutating}
        onActivate={() => updateStatus.mutate("active")}
        onClose={() => updateStatus.mutate("closed")}
      />

      <ExportActions
        onOpenImport={() => setImportOpen(true)}
        exporting={exporting}
        periodStatus={summary?.period?.status}
        onExportCsv={async () => {
          try {
            setExporting("csv");
            const periodName = summary?.period?.name ?? `periodo-${parsedId}`;
            await apiDownload(
              `/admin/periods/${parsedId}/export/csv`,
              `reporte-${safeFileName(periodName)}.csv`
            );
          } catch (e: any) {
            alert(`No se pudo exportar CSV: ${e.message}`);
          } finally {
            setExporting(null);
          }
        }}
        onExportPdf={async () => {
          try {
            setExporting("pdf");
            const periodName = summary?.period?.name ?? `periodo-${parsedId}`;
            await apiDownload(
              `/admin/periods/${parsedId}/report/pdf`,
              `reporte-${safeFileName(periodName)}.pdf`
            );
          } catch (e: any) {
            alert(`No se pudo exportar PDF: ${e.message}`);
          } finally {
            setExporting(null);
          }
        }}
      />

      <PeriodKpis
        studentsCount={summary?.counts.studentsCount}
        startedCount={summary?.counts.startedCount}
        finishedCount={summary?.counts.finishedCount}
        completionPct={summary?.counts.completionPct}
      />

      <StudentsFilters
        total={total}
        loading={studentsQ.isFetching}
        q={q}
        setQ={setQ}
        status={status}
        setStatus={setStatus}
        course={course}
        courses={courses}
        onCourseChange={(v) => setCourse(v)}
        onApply={onApplyFilters}
      />

      <section className="card">
        <StudentsTable
          rows={rows}
          loading={studentsQ.isFetching}
          totalQuestions={TOTAL_QUESTIONS}
          statusLabel={statusLabel}
          statusPillClass={statusPillClass}
          progressPct={progressPct}
        />

        <StudentsPagination
          page={page}
          totalPages={totalPages}
          loading={studentsQ.isFetching}
          onPrev={() => goPage(page - 1)}
          onNext={() => goPage(page + 1)}
        />
      </section>

      <ImportStudentsModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        periodId={parsedId}
        onImported={() => {
          summaryQ.refetch();
          studentsQ.refetch();
        }}
      />
    </div>
  );
}
