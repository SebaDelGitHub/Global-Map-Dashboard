import '../styles/helpModal.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDownloadCsv: () => void;
};

export default function HelpModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="help-overlay" role="dialog" aria-modal="true" aria-label="Help dialog">
      <div className="help-card">
        <div className="help-header">
          <div>
            <h2>How to use</h2>
          </div>
          <button className="help-close" aria-label="Close help" onClick={onClose}>×</button>
        </div>

        <div className="help-body">
          <ol>
            <li>
              First, download the CSV template and fill the <strong>value</strong> column with your numeric data.
            </li>
            <li>
              Next, upload the completed <code>.csv</code> using the <em>Upload CSV</em> button.
            </li>
            <li>
              Finally, export your map as a <code>PNG</code> image.
            </li>
          </ol>

          <p className="help-note">Note: The <strong>value</strong> column must contain numbers only. Non-numeric values will be ignored.</p>
        </div>
      </div>
    </div>
  );
}
