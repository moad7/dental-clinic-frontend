import { MdDelete, MdOutlineCloudUpload } from 'react-icons/md';
import './serviceModal.css';
import { useState } from 'react';

const AddServiceModal = () => {
  const [image, setImage] = useState(null);
  const [activeDoctor, setActiveDoctor] = useState(null);

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setImage({
      file,
      preview,
    });
  };

  const handleRemove = () => {
    setImage(null);
  };

  return (
    <div className="service-row">
      {/* Right: doctors */}
      <div className="service-side">
        <div className="side-title">
          <span className="side-title-main"> בחר רופא</span>
          <span className="side-title-sub">בחר את הרופא שהוקצה לשירות זה</span>
        </div>

        <div className="doctor-grid">
          {[
            'ד"ר פואד סאלח',
            `ד"ר בשיר מוג'בסן`,
            `ד"ר סאלם סבאח`,
            'ד"ר מוניר סאלם',
          ].map((d) => (
            <button
              key={d}
              onClick={() => setActiveDoctor(d)}
              className={'doctor-card' + (activeDoctor === d ? ' active' : '')}
            >
              <div className="doc-avatar">E</div>
              <div className="doc-groub">
                <div className="doc-name">{d}</div>
                <div className="doc-sub">עקירת שן</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Left: form */}
      <div className="service-form">
        <div className="modal-groub">
          <label className="label-modal">שם השירות</label>
          <input className="input-modal" placeholder="עקירת שן (Extraction)" />
        </div>
        <div className="modal-groub">
          <label className="label-modal">תמונת שירות</label>

          <div className="upload-picture-service-box">
            <div className="upload-picture-service-content">
              <input
                type="file"
                id="fileUpload"
                className="upload-input"
                onChange={handleSelectImage}
              />
              {!image ? (
                <div className="upload-picture-service-content">
                  <label htmlFor="fileUpload" className="upload-icon-box">
                    <MdOutlineCloudUpload size={22} />
                  </label>

                  <div className="upload-text-box">
                    <small className="upload-title">העלה תמונה של השירות</small>

                    <small className="upload-subtitle">
                      PDF, JPG, PNG up to 10MB
                    </small>
                  </div>
                </div>
              ) : (
                <div className="image-preview-box">
                  <img src={image.preview} className="image-preview" />

                  <div className="image-delete-btn" onClick={handleRemove}>
                    <MdDelete size={18} />
                  </div>
                </div>
              )}

              {/* <div className="upload-text-box">
                <small className="upload-title">העלה תמונה של השירות</small>
                <small className="upload-subtitle">
                  PDF, JPG, PNG up to 10MB
                </small>
              </div> */}
            </div>
          </div>
        </div>
        <div className="modal-groub">
          <label className="label-modal">תיאור השירות</label>
          <textarea className="textarea-modal" rows={5} placeholder="..." />
        </div>

        <div className="row2 modal-groub ">
          <div>
            <label className="label-modal">משך זמן (דקות)</label>
            <input className="input-modal" placeholder="00" />
          </div>
          <div>
            <label className="label-modal">מחיר (₪)</label>
            <input className="input-modal" placeholder="00" />
          </div>
        </div>
        <div
          className="modal-groub"
          style={{ display: 'flex', border: '2.5px solid #ECEFF3' }}
        ></div>
        <div className="modal-groub">
          <button
            className="btn-create-service full"
            onClick={() => alert('create')}
          >
            צור שירות
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
