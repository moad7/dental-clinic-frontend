import { useContext, useState } from 'react';
import { AppDataContext } from '../../../../context/AppDataContext';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import { SlArrowUp } from 'react-icons/sl';
import './bookAppointment.css';
import BookingPage from './bookingPage/BookingPage';
const BookAppointment = () => {
  const { serviceGroups } = useContext(AppDataContext);
  const [service, setService] = useState(null);
  const [search, setSearch] = useState('');
  return (
    <>
      <div className="main-container" dir="rtl">
        <BoxHeader
          title={service ? 'הזמן את הפגישה שלך' : ''}
          subtitle={
            service && `מלאו את הטופס למטה כדי לתאם את תור ${service.name} שלכם`
          }
          searchBox={!service}
          search={search}
          setSearch={setSearch}
        />
        {service ? (
          <>
            <BookingPage service={service} setService={setService} />
          </>
        ) : (
          <>
            {serviceGroups.length > 0 &&
              serviceGroups.map((group) => (
                <section
                  key={group._id}
                  className="patient-clinic-service-group-panel"
                >
                  <div className="patient-clinic-service-group-header">
                    <h3 className="patient-clinic-service-group-title">
                      {group.title}
                    </h3>
                    <button
                      className="patient-clinic-service-group-collapse-btn"
                      type="button"
                    >
                      <SlArrowUp />
                    </button>
                  </div>
                  <div className="patient-clinic-service-cards-row">
                    {group.services?.map((serviceItem) => (
                      <div
                        key={serviceItem._id}
                        className="patient-clinic-service-card"
                      >
                        <div className="patient-clinic-service-card-top">
                          {serviceItem.photo && (
                            <img
                              src={serviceItem.photo}
                              alt={serviceItem.name}
                              className="patient-clinic-service-thumb"
                            />
                          )}
                        </div>
                        <div className="patient-clinic-service-name-wrap">
                          <h4 className="patient-clinic-service-name">
                            {serviceItem.name}
                          </h4>
                        </div>
                        <div className="patient-clinic-service-info">
                          <strong>
                            {serviceItem.description ?? 'אין תיאור'}
                          </strong>
                        </div>
                        <div className="patient-clinic-service-divider" />
                        <div className="patient-clinic-service-bottom">
                          <div>
                            <span>מחיר השירות</span>
                            <strong>
                              {serviceItem.price
                                ? `₪${serviceItem.price}`
                                : 'אין מחיר'}
                            </strong>
                          </div>
                          <div>
                            <span>זמן</span>
                            <strong>
                              {serviceItem.durationMin || 'אין זמן מעורך'} דקות
                            </strong>
                          </div>
                        </div>
                        <button
                          className="patient-clinic-service-book-btn"
                          type="button"
                          onClick={() => {
                            console.log(serviceItem._id);
                            setService({
                              ...serviceItem,
                              serviceGroupId: group._id,
                              serviceGroupTitle: group.title,
                              serviceItemId: serviceItem._id,
                            });
                          }}
                        >
                          <span>הזמין עכשיו</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
          </>
        )}
      </div>
    </>
  );
};
export default BookAppointment;
