import React from 'react';
import './addDoctorModal.css';
import { useState } from 'react';

const days = [
  { key: 'sunday', label: 'יום ראשון' },
  { key: 'monday', label: 'יום שני' },
  { key: 'tuesday', label: 'יום שלישי' },
  { key: 'wednesday', label: 'יום רביעי' },
  { key: 'thursday', label: 'יום חמישי' },
  { key: 'friday', label: 'יום שישי' },
  { key: 'saturday', label: 'יום שבת' },
];

const defaultWorkingHours = days.map((d) => ({
  day: d.key,
  isClosed: d.key === 'friday' || d.key === 'saturday',
  start: '09:00',
  end: '17:00',
}));

const AddDoctorModal = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    gender: '',
    avatar: '',
    licenseNumber: '',
    yearsOfExperience: '',
    languages: '',
    bio: '',
    services: [],
    workingHours: defaultWorkingHours,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((option) =>
      JSON.parse(option.value),
    );

    setFormData((prev) => ({
      ...prev,
      services: selected,
    }));
  };

  const handleWorkingHourChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedHours = [...prev.workingHours];

      updatedHours[index] = {
        ...updatedHours[index],
        [field]: value,
      };

      return {
        ...prev,
        workingHours: updatedHours,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      gender: formData.gender,
      avatar: formData.avatar,
      role: 'doctor',

      doctor: {
        services: formData.services,
        licenseNumber: formData.licenseNumber,
        yearsOfExperience: Number(formData.yearsOfExperience),
        languages: formData.languages
          .split(',')
          .map((lang) => lang.trim())
          .filter(Boolean),
        bio: formData.bio,
        workingHours: formData.workingHours,
      },
    };

    console.log(payload);
  };

  return (
    // <form onSubmit={handleSubmit}>
    //   <div
    //     style={{
    //       display: 'flex',
    //       flexDirection: 'column',
    //       borderRadius: '9px',
    //       padding: '18px',
    //       gap: '22px',
    //       backgroundColor: '#ffffff',
    //       direction: 'rtl',
    //     }}
    //   >
    //     <h3>إضافة طبيب جديد</h3>

    //     {/* Basic Info */}
    //     <div>
    //       <h4>معلومات أساسية</h4>

    //       <input
    //         name="name"
    //         placeholder="اسم الطبيب"
    //         value={formData.name}
    //         onChange={handleChange}
    //         required
    //       />

    //       <input
    //         name="phoneNumber"
    //         placeholder="رقم الهاتف"
    //         value={formData.phoneNumber}
    //         onChange={handleChange}
    //         required
    //       />

    //       <input
    //         name="email"
    //         placeholder="البريد الإلكتروني"
    //         value={formData.email}
    //         onChange={handleChange}
    //       />

    //       <select
    //         name="gender"
    //         value={formData.gender}
    //         onChange={handleChange}
    //         required
    //       >
    //         <option value="">اختر الجنس</option>
    //         <option value="male">ذكر</option>
    //         <option value="female">أنثى</option>
    //       </select>

    //       <input
    //         name="avatar"
    //         placeholder="رابط الصورة"
    //         value={formData.avatar}
    //         onChange={handleChange}
    //       />
    //     </div>

    //     {/* Doctor Info */}
    //     <div>
    //       <h4>معلومات الطبيب</h4>

    //       <input
    //         name="licenseNumber"
    //         placeholder="رقم الترخيص"
    //         value={formData.licenseNumber}
    //         onChange={handleChange}
    //       />

    //       <input
    //         type="number"
    //         name="yearsOfExperience"
    //         placeholder="سنوات الخبرة"
    //         value={formData.yearsOfExperience}
    //         onChange={handleChange}
    //       />

    //       <input
    //         name="languages"
    //         placeholder="اللغات مثال: Arabic, Hebrew, English"
    //         value={formData.languages}
    //         onChange={handleChange}
    //       />

    //       <textarea
    //         name="bio"
    //         placeholder="نبذة عن الطبيب"
    //         value={formData.bio}
    //         onChange={handleChange}
    //       />
    //     </div>

    //     {/* Services */}
    //     <div>
    //       <h4>الخدمات</h4>

    //       <select multiple onChange={handleServiceChange} required>
    //         <option
    //           value={JSON.stringify({
    //             groupId: 'GROUP_ID_1',
    //             serviceId: 'SERVICE_ID_1',
    //           })}
    //         >
    //           تنظيف أسنان
    //         </option>

    //         <option
    //           value={JSON.stringify({
    //             groupId: 'GROUP_ID_1',
    //             serviceId: 'SERVICE_ID_2',
    //           })}
    //         >
    //           تبييض أسنان
    //         </option>

    //         <option
    //           value={JSON.stringify({
    //             groupId: 'GROUP_ID_2',
    //             serviceId: 'SERVICE_ID_3',
    //           })}
    //         >
    //           زراعة أسنان
    //         </option>
    //       </select>
    //     </div>

    //     {/* Working Hours */}
    //     <div>
    //       <h4>أوقات العمل</h4>

    //       {formData.workingHours.map((item, index) => (
    //         <div
    //           key={item.day}
    //           style={{
    //             display: 'grid',
    //             gridTemplateColumns: '100px 100px 1fr 1fr',
    //             gap: '10px',
    //             alignItems: 'center',
    //             marginBottom: '10px',
    //           }}
    //         >
    //           <strong>{days.find((d) => d.key === item.day)?.label}</strong>

    //           <label>
    //             <input
    //               type="checkbox"
    //               checked={!item.isClosed}
    //               onChange={(e) =>
    //                 handleWorkingHourChange(
    //                   index,
    //                   'isClosed',
    //                   !e.target.checked,
    //                 )
    //               }
    //             />
    //             مفتوح
    //           </label>

    //           <input
    //             type="time"
    //             value={item.start}
    //             disabled={item.isClosed}
    //             onChange={(e) =>
    //               handleWorkingHourChange(index, 'start', e.target.value)
    //             }
    //           />

    //           <input
    //             type="time"
    //             value={item.end}
    //             disabled={item.isClosed}
    //             onChange={(e) =>
    //               handleWorkingHourChange(index, 'end', e.target.value)
    //             }
    //           />
    //         </div>
    //       ))}
    //     </div>

    //     <button type="submit">حفظ الطبيب</button>
    //   </div>
    // </form>

    <form className="doctor-form" onSubmit={handleSubmit}>
      <div className="doctor-form-grid">
        <div className="form-field-add-doctor">
          <label>שמו המלא של הרופא</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field-add-doctor">
          <label>הטלפון</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+972 50 000 0000"
            required
          />
        </div>

        <div className="form-field-add-doctor">
          <label>דוא"ל</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="doctor@email.com"
          />
        </div>

        <div className="form-field-add-doctor">
          <label>מין</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">בחר מין</option>
            <option value="male">זכר</option>
            <option value="female">נקבה</option>
          </select>
        </div>

        {/* <div className="form-field">
          <label>رقم الترخيص</label>
          <input
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            placeholder="123456"
          />
        </div> */}

        <div className="form-field-add-doctor">
          <label>שנים של ניסיון</label>
          <input
            type="number"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            // placeholder="5"
          />
        </div>

        {/* <div className="form-field">
          <label>שפות</label>
          <input
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            placeholder="Arabic, Hebrew, English"
          />
        </div> */}

        <div className="form-field-add-doctor">
          <label>שירותי רופא</label>

          <select
            multiple
            value={formData.services.map((s) => JSON.stringify(s))}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((opt) =>
                JSON.parse(opt.value),
              );

              setFormData((prev) => ({ ...prev, services: selected }));
            }}
            required
          >
            <option
              value={JSON.stringify({
                groupId: 'GROUP_ID_1',
                serviceId: 'SERVICE_ID_1',
              })}
            >
              שתלים דנטליים
            </option>
            <option
              value={JSON.stringify({
                groupId: 'GROUP_ID_1',
                serviceId: 'SERVICE_ID_2',
              })}
            >
              ניקוי שיניים
            </option>
            <option
              value={JSON.stringify({
                groupId: 'GROUP_ID_2',
                serviceId: 'SERVICE_ID_3',
              })}
            >
              הלבנת שיניים
            </option>
          </select>
        </div>

        <div className="form-field-add-doctor full-width">
          <label>אודות הרופא</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="כתבו סיכום קצר על הרופא."
          />
        </div>

        <div className="working-box full-width">
          <label className="section-label">שעות עבודה</label>

          {formData.workingHours.map((item, index) => (
            <div className="working-row" key={item.day}>
              <span>{days.find((d) => d.key === item.day)?.label}</span>

              <label className="open-check">
                <input
                  type="checkbox"
                  checked={!item.isClosed}
                  onChange={(e) =>
                    handleWorkingHourChange(
                      index,
                      'isClosed',
                      !e.target.checked,
                    )
                  }
                />
                פתוח
              </label>

              <input
                type="time"
                value={item.start}
                disabled={item.isClosed}
                onChange={(e) =>
                  handleWorkingHourChange(index, 'start', e.target.value)
                }
              />

              <input
                type="time"
                value={item.end}
                disabled={item.isClosed}
                onChange={(e) =>
                  handleWorkingHourChange(index, 'end', e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <button className="submit-btn" type="submit">
        הוסף רופא
      </button>
    </form>
  );
};

export default AddDoctorModal;
