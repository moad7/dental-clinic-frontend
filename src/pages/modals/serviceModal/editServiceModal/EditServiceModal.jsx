import { useContext, useEffect, useRef, useState } from 'react';
import {
  FiClock,
  FiDollarSign,
  FiImage,
  FiLink,
  FiUpload,
} from 'react-icons/fi';
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import './editServiceModal.css';
import { updateServiceItem } from '../../../../api/serviceApi';
import { AuthContext } from '../../../../context/AuthContext';
const EditServiceModal = ({ service, onClose }) => {
  const { token } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    durationMin: '',
    active: true,
    photo: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageType, setImageType] = useState('url');
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!service) return;
    console.log(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      price: service.price ?? '',
      durationMin: service.durationMin ?? '',
      active: service.active ?? true,
      photo: service.photo || '',
    });
    setImageType('url');
    setPhotoFile(null);
    setPreview(service.photo || '');
  }, [service]);
  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };
  const handleImageUrlChange = (event) => {
    const value = event.target.value;
    setFormData((previous) => ({
      ...previous,
      photo: value,
    }));
    setPreview(value);
  };
  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('יש לבחור תמונה מסוג JPG, PNG או WEBP');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('גודל התמונה חייב להיות עד 5MB');
      event.target.value = '';
      return;
    }
    setPhotoFile(file);
    setPreview((previousPreview) => {
      if (previousPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(previousPreview);
      }
      return URL.createObjectURL(file);
    });
  };
  const handleImageTypeChange = (type) => {
    setImageType(type);
    if (type === 'url') {
      setPreview(formData.photo || '');
      return;
    }
    // FILE
    if (!photoFile) {
      setPreview('');
      return;
    }
    setPreview((previousPreview) => {
      if (previousPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(previousPreview);
      }
      return URL.createObjectURL(photoFile);
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      toast.error('יש להזין שם שירות');
      return;
    }
    if (!formData.durationMin || Number(formData.durationMin) < 5) {
      toast.error('משך השירות חייב להיות לפחות 5 דקות');
      return;
    }
    if (formData.price === '' || Number(formData.price) < 0) {
      toast.error('יש להזין מחיר תקין');
      return;
    }
    if (imageType === 'url' && !formData.photo.trim()) {
      toast.error('יש להזין קישור לתמונה');
      return;
    }
    if (imageType === 'file' && !photoFile) {
      toast.error('יש לבחור תמונה מהמחשב');
      return;
    }
    try {
      setLoading(true);
      if (imageType === 'url') {
        const payload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          durationMin: Number(formData.durationMin),
          active: formData.active,
          imageUrl: formData.photo.trim(),
        };
        console.log('UPDATE SERVICE URL:', payload);
        await updateServiceItem(
          service.serviceGroupId,
          service._id,
          payload,
          token,
        );
      }
      if (imageType === 'file') {
        const payload = new FormData();
        payload.append('name', formData.name.trim());
        payload.append('description', formData.description.trim());
        payload.append('price', String(Number(formData.price)));
        payload.append('durationMin', String(Number(formData.durationMin)));
        payload.append('active', String(formData.active));
        payload.append('photo', photoFile);
        await updateServiceItem(
          service.serviceGroupId,
          service._id,
          payload,
          token,
        );
      }
      toast.success('השירות עודכן בהצלחה');
      onClose?.();
    } catch (error) {
      console.error('Update service error:', error);
      toast.error(
        error?.response?.data?.message || 'אירעה שגיאה בעדכון השירות',
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = () => {};
  return (
    <form className="edit-service-modal" dir="rtl" onSubmit={handleSubmit}>
      <div className="edit-service-section">
        <div className="edit-service-section-header">
          <div>
            <h3>פרטי השירות</h3>
            <p>עדכנו את פרטי השירות המוצגים למטופלים</p>
          </div>
        </div>
        <div className="edit-service-main-layout">
          <div className="edit-service-image-area">
            <span className="edit-service-label">תמונת השירות</span>
            {/* IMAGE TYPE */}
            <div className="edit-service-image-type">
              <button
                type="button"
                className={`edit-service-image-type-btn ${
                  imageType === 'url' ? 'active' : ''
                }`}
                onClick={() => handleImageTypeChange('url')}
              >
                <FiLink size={14} />
                <span>קישור URL</span>
              </button>
              <button
                type="button"
                className={`edit-service-image-type-btn ${
                  imageType === 'file' ? 'active' : ''
                }`}
                onClick={() => handleImageTypeChange('file')}
              >
                <FiUpload size={14} />
                <span>העלאת קובץ</span>
              </button>
            </div>
            {imageType === 'url' && (
              <div className="edit-service-url-area">
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.photo}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="edit-service-image-url-input"
                  dir="ltr"
                />
              </div>
            )}
            {imageType === 'file' && (
              <div className="edit-service-file-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  className="edit-service-upload-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiUpload size={16} />
                  <span>{photoFile ? 'החלפת תמונה' : 'בחר תמונה מהמחשב'}</span>
                </button>
                {photoFile && (
                  <span className="edit-service-file-name">
                    {photoFile.name}
                  </span>
                )}
              </div>
            )}
            <div className="edit-service-image-box">
              {preview ? (
                <img
                  src={preview}
                  alt={formData.name || 'service'}
                  className="edit-service-image-preview"
                />
              ) : (
                <div className="edit-service-image-placeholder">
                  <FiImage size={28} />
                  <span>אין תמונה</span>
                </div>
              )}
              {imageType === 'file' && photoFile && (
                <span className="edit-service-new-image-badge">תמונה חדשה</span>
              )}
            </div>
            <p className="edit-service-image-help">
              ניתן להזין URL או להעלות PNG, JPG, WEBP עד 5MB
            </p>
          </div>
          <div className="edit-service-fields">
            <div className="edit-service-field">
              <label htmlFor="edit-service-name">
                שם השירות
                <span>*</span>
              </label>
              <input
                id="edit-service-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="שם השירות"
              />
            </div>
            <div className="edit-service-field">
              <label htmlFor="edit-service-description">תיאור השירות</label>
              <textarea
                id="edit-service-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="הוסיפו תיאור קצר על השירות"
                rows={5}
                maxLength={500}
              />
              <span className="edit-service-counter">
                {formData.description.length}
                /500
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="edit-service-section">
        <div className="edit-service-section-header">
          <div>
            <h3>מחיר ומשך השירות</h3>
            <p>הגדירו את המחיר ואת משך הטיפול</p>
          </div>
        </div>
        <div className="edit-service-two-columns">
          <div className="edit-service-field">
            <label htmlFor="edit-service-price">מחיר השירות</label>
            <div className="edit-service-input-with-icon">
              <FiDollarSign />
              <input
                id="edit-service-price"
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
              />
              <span>₪</span>
            </div>
          </div>
          <div className="edit-service-field">
            <label htmlFor="edit-service-duration">משך השירות</label>
            <div className="edit-service-input-with-icon">
              <FiClock />
              <input
                id="edit-service-duration"
                type="number"
                name="durationMin"
                min="5"
                step="5"
                value={formData.durationMin}
                onChange={handleChange}
                placeholder="30"
              />
              <span>דקות</span>
            </div>
          </div>
        </div>
      </div>
      <div className="edit-service-section edit-service-status-section">
        <div>
          <h3>סטטוס השירות</h3>
          <p>שירות פעיל יהיה זמין למטופלים בעת קביעת תור</p>
        </div>
        <label className="edit-service-switch">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                active: event.target.checked,
              }))
            }
          />
          <span className="edit-service-switch-slider" />
          <strong>{formData.active ? 'פעיל' : 'לא פעיל'}</strong>
        </label>
      </div>
      {/* <div className="edit-service-actions">
        <button
          type="button"
          className="edit-service-cancel-btn"
          onClick={onClose}
          disabled={loading}
        >
          ביטול
        </button>
        <button
          type="submit"
          className="edit-service-save-btn"
          disabled={loading}
        >
          {loading ? 'שומר...' : 'שמירת שינויים'}
        </button>
      </div> */}
      <div className="edit-service-actions" dir="rtl">
        {showDeleteConfirm ? (
          <div className="edit-service-delete-confirm">
            <div className="delete-confirm-info">
              <AlertTriangle size={20} />
              <div>
                <p className="delete-confirm-title">
                  האם אתה בטוח שברצונך למחוק את השירות?
                </p>
                <span className="delete-confirm-description">
                  פעולה זו אינה ניתנת לביטול.
                </span>
              </div>
            </div>
            <div className="delete-confirm-buttons">
              <button
                type="button"
                className="edit-service-cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                ביטול
              </button>
              <button
                type="button"
                className="edit-service-confirm-delete-btn"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 size={16} />
                {loading ? 'מוחק...' : 'כן, מחק שירות'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="edit-service-delete-btn"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
            >
              <Trash2 size={16} />
              מחיקת שירות
            </button>
            <div className="edit-service-actions-group">
              <button
                type="button"
                className="edit-service-cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                ביטול
              </button>
              <button
                type="submit"
                className="edit-service-save-btn"
                disabled={loading}
              >
                {loading ? 'שומר...' : 'שמירת שינויים'}
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};
export default EditServiceModal;
