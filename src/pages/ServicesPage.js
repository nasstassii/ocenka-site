import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ServicesPage() {
  const [pricesNeeds, setPricesNeeds] = useState({});
  const [pricesMovable, setPricesMovable] = useState({});
  const [loading, setLoading] = useState(true);
  
  const realEstateRef = useRef(null);
  const movableRef = useRef(null);
  const rentRightRef = useRef(null);

  useEffect(() => {
    loadPrices();
  }, []);

  useEffect(() => {
    if (!loading) {
      const hash = window.location.hash;
      setTimeout(() => {
        if (hash === '#real-estate' && realEstateRef.current) {
          realEstateRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === '#movable' && movableRef.current) {
          movableRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === '#rent-right' && rentRightRef.current) {
          rentRightRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [loading]);

  const loadPrices = async () => {
    try {
      // ВАЖНО: локальный сервер на порту 5000
      const needsRes = await fetch('http://localhost:5000/api/content/prices_needs/all');
      const movableRes = await fetch('http://localhost:5000/api/content/prices_movable/all');
      const needsData = await needsRes.json();
      const movableData = await movableRes.json();
      setPricesNeeds(needsData);
      setPricesMovable(movableData);
    } catch (err) {
      console.error('Ошибка загрузки цен:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-spinner">Загрузка цен...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <section className="page-hero">
        <div className="container">
          <h1>Услуги и цены</h1>
          <p>Прозрачные цены, фиксированные сроки, индивидуальный подход к каждому объекту</p>
        </div>
      </section>

      <section className="price-section">
        <div className="container">
          <div className="intro-text">
            <p>Оценщиком проводится оценка недвижимости и движимого имущества для различных целей: оценка для оформления наследственного имущества; оценка для родственного раздела имущества; оценка для предоставления в органы опеки; оценка для продажи; оценка для суда; оценка для определения стоимости права пользования и др.</p>
          </div>

          {/* Оценка недвижимости */}
          <div id="real-estate" ref={realEstateRef} className="price-card">
            <h3>Оценка недвижимости</h3>
            <table className="price-table">
              <thead>
                <tr>
                  <th>Услуга</th>
                  <th>Срок</th>
                  <th>Стоимость</th>
                </tr>
              </thead>
              <tbody>
                <tr className="section-header">
                  <td colSpan="3"><strong>Квартиры, комнаты, доли</strong></td>
                </tr>
                {pricesNeeds.apartment_base && (
                  <tr>
                    <td className="service-name">{pricesNeeds.apartment_base.name}</td>
                    <td className="service-term">{pricesNeeds.apartment_base.term}</td>
                    <td className="service-price">{pricesNeeds.apartment_base.price}</td>
                  </tr>
                )}
                {pricesNeeds.apartment_comfort && (
                  <tr>
                    <td className="service-name">{pricesNeeds.apartment_comfort.name}</td>
                    <td className="service-term">{pricesNeeds.apartment_comfort.term}</td>
                    <td className="service-price">{pricesNeeds.apartment_comfort.price}</td>
                  </tr>
                )}
                {pricesNeeds.apartment_urgent && (
                  <tr>
                    <td className="service-name">{pricesNeeds.apartment_urgent.name}</td>
                    <td className="service-term">{pricesNeeds.apartment_urgent.term}</td>
                    <td className="service-price">{pricesNeeds.apartment_urgent.price}</td>
                  </tr>
                )}

                <tr className="section-header">
                  <td colSpan="3"><strong>Жилые дома и коттеджи</strong></td>
                </tr>
                {pricesNeeds.house_50 && (
                  <tr>
                    <td className="service-name">{pricesNeeds.house_50.name}</td>
                    <td className="service-term">{pricesNeeds.house_50.term}</td>
                    <td className="service-price">{pricesNeeds.house_50.price}</td>
                  </tr>
                )}
                {pricesNeeds.house_100 && (
                  <tr>
                    <td className="service-name">{pricesNeeds.house_100.name}</td>
                    <td className="service-term">{pricesNeeds.house_100.term}</td>
                    <td className="service-price">{pricesNeeds.house_100.price}</td>
                  </tr>
                )}
                {pricesNeeds.house_150 && (
                  <tr>
                    <td className="service-name">{pricesNeeds.house_150.name}</td>
                    <td className="service-term">{pricesNeeds.house_150.term}</td>
                    <td className="service-price">{pricesNeeds.house_150.price}</td>
                  </tr>
                )}
                {pricesNeeds.house_more && (
                  <tr>
                    <td className="service-name">{pricesNeeds.house_more.name}</td>
                    <td className="service-term">{pricesNeeds.house_more.term}</td>
                    <td className="service-price">{pricesNeeds.house_more.price}</td>
                  </tr>
                )}

                <tr className="section-header">
                  <td colSpan="3"><strong>Земельные участки</strong></td>
                </tr>
                {pricesNeeds.land && (
                  <tr>
                    <td className="service-name">{pricesNeeds.land.name}</td>
                    <td className="service-term">{pricesNeeds.land.term}</td>
                    <td className="service-price">{pricesNeeds.land.price}</td>
                  </tr>
                )}
                {pricesNeeds.land_commercial && (
                  <tr>
                    <td className="service-name">{pricesNeeds.land_commercial.name}</td>
                    <td className="service-term">{pricesNeeds.land_commercial.term}</td>
                    <td className="service-price">{pricesNeeds.land_commercial.price}</td>
                  </tr>
                )}

                <tr className="section-header">
                  <td colSpan="3"><strong>Гаражи и нежилые объекты</strong></td>
                </tr>
                {pricesNeeds.garage && (
                  <tr>
                    <td className="service-name">{pricesNeeds.garage.name}</td>
                    <td className="service-term">{pricesNeeds.garage.term}</td>
                    <td className="service-price">{pricesNeeds.garage.price}</td>
                  </tr>
                )}
                {pricesNeeds.non_residential_sale && (
                  <tr>
                    <td className="service-name">{pricesNeeds.non_residential_sale.name}</td>
                    <td className="service-term">{pricesNeeds.non_residential_sale.term}</td>
                    <td className="service-price">{pricesNeeds.non_residential_sale.price}</td>
                  </tr>
                )}
                {pricesNeeds.non_residential_court && (
                  <tr>
                    <td className="service-name">{pricesNeeds.non_residential_court.name}</td>
                    <td className="service-term">{pricesNeeds.non_residential_court.term}</td>
                    <td className="service-price">{pricesNeeds.non_residential_court.price}</td>
                  </tr>
                )}
                {pricesNeeds.building_sale && (
                  <tr>
                    <td className="service-name">{pricesNeeds.building_sale.name}</td>
                    <td className="service-term">{pricesNeeds.building_sale.term}</td>
                    <td className="service-price">{pricesNeeds.building_sale.price}</td>
                  </tr>
                )}
                {pricesNeeds.building_court && (
                  <tr>
                    <td className="service-name">{pricesNeeds.building_court.name}</td>
                    <td className="service-term">{pricesNeeds.building_court.term}</td>
                    <td className="service-price">{pricesNeeds.building_court.price}</td>
                  </tr>
                )}
                {pricesNeeds.built_in && (
                  <tr>
                    <td className="service-name">{pricesNeeds.built_in.name}</td>
                    <td className="service-term">{pricesNeeds.built_in.term}</td>
                    <td className="service-price">{pricesNeeds.built_in.price}</td>
                  </tr>
                )}

                <tr className="section-header">
                  <td colSpan="3"><strong>Скидки при заказе оценки одновременно нескольких объектов</strong></td>
                </tr>
                {pricesNeeds.discount_2 && (
                  <tr className="discount-row">
                    <td className="service-name">{pricesNeeds.discount_2.name}</td>
                    <td className="service-term">{pricesNeeds.discount_2.term}</td>
                    <td className="service-price">{pricesNeeds.discount_2.price}</td>
                  </tr>
                )}
                {pricesNeeds.discount_3 && (
                  <tr className="discount-row">
                    <td className="service-name">{pricesNeeds.discount_3.name}</td>
                    <td className="service-term">{pricesNeeds.discount_3.term}</td>
                    <td className="service-price">{pricesNeeds.discount_3.price}</td>
                  </tr>
                )}
                {pricesNeeds.discount_more && (
                  <tr className="discount-row">
                    <td className="service-name">{pricesNeeds.discount_more.name}</td>
                    <td className="service-term">{pricesNeeds.discount_more.term}</td>
                    <td className="service-price">{pricesNeeds.discount_more.price}</td>
                  </tr>
                )}

                <tr id="rent-right" ref={rentRightRef} className="section-header">
                  <td colSpan="3"><strong>Права пользования</strong></td>
                </tr>
                {pricesNeeds.rent_right && (
                  <tr>
                    <td className="service-name">{pricesNeeds.rent_right.name}</td>
                    <td className="service-term">{pricesNeeds.rent_right.term}</td>
                    <td className="service-price">{pricesNeeds.rent_right.price}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="intro-text">
            <p>Оценка автотранспорта является очень востребованной оценочной услугой. Потребность в оценке автомобилей и других транспортных средств возникает в случае продажи, при имущественных спорах. Поскольку автотранспорт не имеет кадастровой стоимости, его оценка обязательно производится и при оформлении наследства.</p>
          </div>

          {/* Оценка движимого имущества */}
          <div id="movable" ref={movableRef} className="price-card">
            <h3>Оценка движимого имущества</h3>
            <table className="price-table">
              <thead>
                <tr>
                  <th>Услуга</th>
                  <th>Срок</th>
                  <th>Стоимость</th>
                </tr>
              </thead>
              <tbody>
                <tr className="section-header">
                  <td colSpan="3"><strong>Автотранспорт</strong></td>
                </tr>
                {pricesMovable.car_light && (
                  <tr>
                    <td className="service-name">{pricesMovable.car_light.name}</td>
                    <td className="service-term">{pricesMovable.car_light.term}</td>
                    <td className="service-price">{pricesMovable.car_light.price}</td>
                  </tr>
                )}
                {pricesMovable.car_truck && (
                  <tr>
                    <td className="service-name">{pricesMovable.car_truck.name}</td>
                    <td className="service-term">{pricesMovable.car_truck.term}</td>
                    <td className="service-price">{pricesMovable.car_truck.price}</td>
                  </tr>
                )}
                {pricesMovable.car_construction && (
                  <tr>
                    <td className="service-name">{pricesMovable.car_construction.name}</td>
                    <td className="service-term">{pricesMovable.car_construction.term}</td>
                    <td className="service-price">{pricesMovable.car_construction.price}</td>
                  </tr>
                )}

                <tr className="section-header">
                  <td colSpan="3"><strong>Оборудование</strong></td>
                </tr>
                {pricesMovable.equipment_serial && (
                  <tr>
                    <td className="service-name">{pricesMovable.equipment_serial.name}</td>
                    <td className="service-term">{pricesMovable.equipment_serial.term}</td>
                    <td className="service-price">{pricesMovable.equipment_serial.price}</td>
                  </tr>
                )}
                {pricesMovable.equipment_special && (
                  <tr>
                    <td className="service-name">{pricesMovable.equipment_special.name}</td>
                    <td className="service-term">{pricesMovable.equipment_special.term}</td>
                    <td className="service-price">{pricesMovable.equipment_special.price}</td>
                  </tr>
                )}
                {pricesMovable.equipment_line && (
                  <tr>
                    <td className="service-name">{pricesMovable.equipment_line.name}</td>
                    <td className="service-term">{pricesMovable.equipment_line.term}</td>
                    <td className="service-price">{pricesMovable.equipment_line.price}</td>
                  </tr>
                )}

                <tr className="section-header">
                  <td colSpan="3"><strong>Иное имущество</strong></td>
                </tr>
                {pricesMovable.cattle && (
                  <tr>
                    <td className="service-name">{pricesMovable.cattle.name}</td>
                    <td className="service-term">{pricesMovable.cattle.term}</td>
                    <td className="service-price">{pricesMovable.cattle.price}</td>
                  </tr>
                )}
                {pricesMovable.goods && (
                  <tr>
                    <td className="service-name">{pricesMovable.goods.name}</td>
                    <td className="service-term">{pricesMovable.goods.term}</td>
                    <td className="service-price">{pricesMovable.goods.price}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="price-note">Расценки и сроки по оценке иных объектов оговариваются индивидуально. При необходимости специальной аккредитации стоимость оговаривается индивидуально.</div>
          </div>

          <div className="price-note center-note">
            Настоящие расценки приведены для информации потенциальных клиентов и не являются публичной офертой.
          </div>
        </div>
      </section>

      <section className="docs-section">
        <div className="container">
          <div className="section-title"><h2>Документы для оценки</h2></div>
          <div className="docs-grid">
            <div className="doc-card">
              <h4>Для недвижимости</h4>
              <ul>
                <li>Выписка из ЕГРН или Сведения из ЕГРН</li>
                <li>Свидетельства о государственной регистрации права собственности (на всех собственников)</li>
                <li>Правоустанавливающие документы (договоры купли-продажи, дарения, свидетельства о праве на наследство и др.)</li>
                <li>Технический паспорт или технический план здания/дома/квартиры/помещения</li>
                <li>Информация о балансовой стоимости имущества</li>
                <li>Свидетельство о смерти наследодателя (при оценке для вступления в наследство)</li>
              </ul>
            </div>
            <div className="doc-card">
              <h4>Для движимого имущества</h4>
              <ul>
                <li>Свидетельство о регистрации транспортного средства/самоходной машины</li>
                <li>Паспорт транспортного средства (ПТС) / самоходной машины</li>
                <li>Данные о пробеге/наработке часов на дату оценки</li>
                <li>Документы, содержащие сведения о марке, модели и иных характеристиках оборудования</li>
                <li>Информация о балансовой стоимости имущества</li>
                <li>Свидетельство о смерти наследодателя (при оценке для вступления в наследство)</li>
              </ul>
            </div>
          </div>
          <p className="docs-note">* Перечень необходимых документов может быть расширен в зависимости от особенностей оцениваемого имущества.</p>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default ServicesPage;