import React from 'react';
import './Skeleton.scss';

// ── Generic shimmer block ──────────────────────────────────────────
export const SkeletonBlock = ({ className = '', style = {} }) => (
  <div className={`skeleton-block ${className}`} style={style} />
);

// ── Subject card skeleton (matches SubjectCard layout) ─────────────
export const SubjectCardSkeleton = () => (
  <div className="subject-card-skeleton">
    <SkeletonBlock className="skeleton-image" />
    <SkeletonBlock className="skeleton-title" style={{ width: '70%' }} />
    <SkeletonBlock className="skeleton-text-sm" style={{ width: '45%' }} />
    <SkeletonBlock className="skeleton-text-sm" style={{ width: '55%' }} />
  </div>
);

// ── Grid of subject card skeletons ─────────────────────────────────
export const SubjectsGridSkeleton = ({ count = 6 }) => (
  <div className="dashboard-skeleton">
    <div className="dashboard-skeleton-header">
      <SkeletonBlock style={{ height: 28, width: 260 }} />
    </div>
    <div className="subjects-skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SubjectCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// ── Folder grid skeleton (matches FolderList layout) ───────────────
export const FolderListSkeleton = () => (
  <div style={{
    marginTop: 24,
    padding: 32,
    borderRadius: 12,
    border: '1px solid var(--border-color)',
    background: 'var(--card-background)',
    textAlign: 'center'
  }}>
    <SkeletonBlock style={{ height: 24, width: 200, margin: '0 auto 28px' }} />
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: 20
    }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="folder-card-skeleton">
          <SkeletonBlock className="skeleton-circle" style={{ width: 48, height: 48 }} />
          <SkeletonBlock style={{ height: 18, width: '65%' }} />
        </div>
      ))}
    </div>
  </div>
);

// ── File list skeleton (matches FileList layout) ───────────────────
export const FileListSkeleton = ({ count = 5 }) => (
  <div style={{
    marginTop: 24,
    padding: 32,
    borderRadius: 12,
    border: '1px solid var(--border-color)',
    background: 'var(--card-background)'
  }}>
    <SkeletonBlock style={{ height: 24, width: 280, margin: '0 auto 24px' }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="file-row-skeleton">
          <SkeletonBlock className="skeleton-circle" style={{ width: 40, height: 40 }} />
          <div className="file-row-skeleton-details">
            <SkeletonBlock style={{ height: 15, width: `${55 + (i % 3) * 15}%` }} />
            <SkeletonBlock style={{ height: 12, width: `${30 + (i % 2) * 20}%` }} />
          </div>
          <SkeletonBlock className="skeleton-btn" />
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonBlock;
