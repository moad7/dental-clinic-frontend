import { MdDelete, MdOutlineCloudUpload } from 'react-icons/md';
import './serviceModal.css';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { createServiceGroup } from '../../../services/service';
import { AuthContext } from '../../../context/AuthContext';
const AddServiceModal = () => {
  const { user } = useContext(AuthContext);

  const [image, setImage] = useState(null);
  // const [activeDoctor, setActiveDoctor] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    durationMin: '',
    price: '',
    photo: '',
  });
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

  const fetchGroups = async () => {
    const res = await axios.get('/api/services');
    // setGroups(res.data);
    setGroups(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupTitle.trim()) return alert('Enter group title');
    console.log(user);

    const res = await createServiceGroup(newGroupTitle, user.tokens[0].token);

    setGroups([res.data, ...groups]);
    setSelectedGroupId(res.data._id);
    setNewGroupTitle('');
    setShowNewGroup(false);
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroupId) return alert('Choose group first');

    const confirmDelete = window.confirm('Delete this group?');
    if (!confirmDelete) return;

    await axios.delete(`/api/services/groups/${selectedGroupId}`);

    setGroups(groups.filter((g) => g._id !== selectedGroupId));
    setSelectedGroupId('');
  };

  const handleCreateService = async () => {
    if (!selectedGroupId) return alert('Choose or create group first');
    if (!form.name.trim()) return alert('Service name is required');

    const payload = {
      name: form.name,
      description: form.description,
      durationMin: Number(form.durationMin),
      price: Number(form.price),
      photo: image?.preview || '',
    };

    const res = await axios.post(
      `/api/services/groups/${selectedGroupId}/services`,
      payload,
    );

    setGroups((prev) =>
      prev.map((g) => (g._id === selectedGroupId ? res.data : g)),
    );

    setForm({
      name: '',
      description: '',
      durationMin: '',
      price: '',
    });

    setImage(null);
  };

  const handleDeleteService = async (serviceId) => {
    if (!selectedGroupId) return;

    const confirmDelete = window.confirm('Delete this service?');
    if (!confirmDelete) return;

    const res = await axios.delete(
      `/api/services/groups/${selectedGroupId}/services/${serviceId}`,
    );

    setGroups((prev) =>
      prev.map((g) => (g._id === selectedGroupId ? res.data : g)),
    );
  };

  // const selectedGroup = groups.find((g) => g._id === selectedGroupId);
  const selectedGroup = Array.isArray(groups)
    ? groups.find((g) => g._id === selectedGroupId)
    : null;
  return (
    <div className="service-row">
      <div className="service-form">
        <div className="modal-groub">
          <label className="label-modal">קבוצת שירות</label>

          <div className="service-group-row">
            <select
              className="input-modal"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              <option value="">בחר קבוצה</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.title}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn-small-service"
              onClick={() => setShowNewGroup(!showNewGroup)}
            >
              +
            </button>

            {selectedGroupId && (
              <button
                type="button"
                className="btn-delete-service"
                onClick={handleDeleteGroup}
              >
                <MdDelete size={18} />
              </button>
            )}
          </div>
        </div>

        {showNewGroup && (
          <div className="modal-groub">
            <label className="label-modal">שם קבוצה חדשה</label>

            <div className="service-group-row">
              <input
                className="input-modal"
                placeholder="לדוגמה: טיפולי שיניים"
                value={newGroupTitle}
                onChange={(e) => setNewGroupTitle(e.target.value)}
              />

              <button
                type="button"
                className="btn-create-service"
                onClick={handleCreateGroup}
              >
                צור
              </button>
            </div>
          </div>
        )}

        <div className="modal-groub">
          <label className="label-modal">שם השירות</label>
          <input
            className="input-modal"
            placeholder="עקירת שן (Extraction)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
            </div>
          </div>
        </div>
        <div className="modal-groub">
          <label className="label-modal">תיאור השירות</label>
          <textarea
            className="textarea-modal"
            rows={5}
            placeholder="..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="row2 modal-groub ">
          <div>
            <label className="label-modal">משך זמן (דקות)</label>
            <input
              className="input-modal"
              placeholder="00"
              value={form.durationMin}
              onChange={(e) =>
                setForm({ ...form, durationMin: e.target.value })
              }
            />
          </div>
          <div>
            <label className="label-modal">מחיר (₪)</label>
            <input
              className="input-modal"
              placeholder="00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
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
      <div className="service-side">
        <div className="side-title">
          <span className="side-title-main">השירותים בקבוצה</span>
          <span className="side-title-sub">
            {selectedGroup ? selectedGroup.title : 'בחר קבוצה להצגת השירותים'}
          </span>
        </div>

        <div className="services-list">
          {!selectedGroup?.services?.length && (
            <div className="empty-services">אין שירותים עדיין</div>
          )}

          {selectedGroup?.services?.map((service) => (
            <div className="service-list-card" key={service._id}>
              <div className="service-list-info">
                {service.photo && (
                  <img
                    src={service.photo}
                    alt={service.name}
                    className="service-list-img"
                  />
                )}

                <div>
                  <div className="service-list-name">{service.name}</div>
                  <div className="service-list-meta">
                    {service.durationMin} דקות · ₪{service.price}
                  </div>
                </div>
              </div>

              <button
                className="service-list-delete"
                onClick={() => handleDeleteService(service._id)}
              >
                <MdDelete size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
