// import React, { useRef, useState, useEffect } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import { FaHospitalAlt, FaCheckCircle, FaMapMarkerAlt, FaUserMd, FaLanguage, FaRegThumbsUp, FaUsers, FaRegCommentDots } from 'react-icons/fa';
// import { MdLocationCity } from 'react-icons/md';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import axios from 'axios';

// const DoctorPortfolio = () => {
//   const { doctor_id } = useParams();
//   const location = useLocation();
//   const scrollRef = useRef(null);
//   const [activeIndex, setActiveIndex] = useState(1);
//   const [doctorData, setDoctorData] = useState(null);
//   const [sections, setSections] = useState([]);
//   const [clinics, setClinics] = useState([]);
//   const [expertise, setExpertise] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [videos, setVideos] = useState([]);
//   const [error, setError] = useState(null);
//   const [selectedTab, setSelectedTab] = useState('experience');
//   const navigate = useNavigate();

//   const isPortfolioRoute = location.pathname.includes('/portfolio');

//   const scrollToCard = (index) => {
//     const container = scrollRef.current;
//     if (!container) return;
//     const cardWidth = 320 + 24;
//     const centerOffset = (container.offsetWidth - cardWidth) / 2;
//     container.scrollTo({
//       left: index * cardWidth - centerOffset,
//       behavior: 'smooth',
//     });
//   };

//   useEffect(() => {
//     scrollToCard(activeIndex);
//   }, [activeIndex]);

//   useEffect(() => {
//     const fetchDoctorData = async () => {
//       if (!doctor_id) {
//         setError('Doctor ID is missing in the URL.');
//         return;
//       }

//       try {
//         const token = localStorage.getItem('authToken');
//         const config = {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         };

//         setError(null);
//         const [doctorRes, sectionsRes, clinicsRes, expertiseRes, reviewsRes, videosRes] = await Promise.all([
//           axios.get(`https://api.onestepmedi.com:8000/doctors/${doctor_id}`, config),
//           axios.get(`https://api.onestepmedi.com:8000/doctors/sections/${doctor_id}`, config),
//           axios.get(`https://api.onestepmedi.com:8000/doctors/clinics/${doctor_id}`, config),
//           axios.get(`https://api.onestepmedi.com:8000/doctors/expertise/${doctor_id}`, config),
//           axios.get(`https://api.onestepmedi.com:8000/doctors/reviews/${doctor_id}`, config),
//           axios.get(`https://api.onestepmedi.com:8000/doctors/videos/${doctor_id}`, config),
//         ]);

//         setDoctorData(doctorRes.data);
//         setSections(Array.isArray(sectionsRes.data) ? sectionsRes.data : []);
//         setClinics(clinicsRes.data);
//         setExpertise(expertiseRes.data);
//         setReviews(reviewsRes.data);
//         setVideos(videosRes.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError(`Failed to fetch doctor data: ${error.message}`);
//         setSections([]);
//       }
//     };

//     fetchDoctorData();
//   }, [doctor_id]);

//   const ArticleCard = ({ art, idx, isActive }) => (
//     <div
//       className={`w-[320px] shrink-0 rounded-xl shadow transition-transform duration-300 p-0 border-0 bg-white/70 flex flex-col h-[220px] relative ${
//         isActive ? 'scale-105 z-10' : 'scale-95 opacity-80'
//       }`}
//       style={{
//         borderRadius: 18,
//         boxShadow: isActive ? '0 4px 24px 0 rgba(52, 110, 208, 0.13)' : '0 1px 6px 0 rgba(52, 110, 208, 0.06)',
//         border: 'none',
//       }}
//     >
//       <div className="flex items-center gap-3 px-4 pt-4 pb-2">
//         <img
//           src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
//           alt="author"
//           className="w-8 h-8 rounded-full object-cover"
//         />
//         <div>
//           <span className="text-xs font-bold text-gray-800">{art.author || 'Dr. Anita S'}</span>
//           <p className="text-[11px] text-gray-400 pt-0.5">17 hours ago</p>
//         </div>
//         <span className="ml-auto">
//           <span className="inline-flex items-center text-xs font-bold px-2 py-1 rounded-full bg-[#FFB800]/20 text-[#FFB800]">
//             {art.tag || 'Cardio'}
//           </span>
//         </span>
//       </div>
//       <img
//         src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
//         alt="article visual"
//         className="mx-4 mt-1 mb-2 rounded-lg object-cover h-[70px] w-[95%]"
//       />
//       <div className="px-4">
//         <p className="font-semibold text-[15px] leading-snug mb-0 text-gray-800">{art.title || '10 Early Signs of Heart Disease'}</p>
//         <p className="text-xs text-gray-500 mb-2">{art.desc || 'When I was studying...'}</p>
//       </div>
//     </div>
//   );

//   if (error) return <div className="text-red-600 text-center p-6">{error}</div>;
//   if (!doctorData) return <div className="text-gray-600 text-center p-6">Loading...</div>;

//   if (isPortfolioRoute) {
//     return (
//       <div className="bg-[#f7fafd] min-h-screen font-sans">
//         <div className="max-w-6xl mx-auto py-10 px-14 flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-md mt-6">
//           <div className="flex-1 flex flex-col justify-center">
//             <h1 className="text-3xl font-bold text-blue-700">{doctorData.name}'s Portfolio</h1>
//             <p className="text-lg text-gray-700">{doctorData.specialization}</p>
//             <p className="text-gray-500 font-semibold mt-1">{doctorData.experience_years}+ years of experience</p>
//           </div>
//           <div className="hidden md:block">
//             <img src={doctorData.profile_img_right} alt="Doctor" className="w-56 h-[250px] object-cover rounded-lg shadow-lg" />
//           </div>
//         </div>

//         <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
//           <div className="flex flex-col md:flex-row gap-8">
//             <div className="md:w-1/3 flex flex-col items-center">
//               <img src={doctorData.profile_img_left} alt="Doctor" className="w-44 h-44 rounded-lg object-cover mb-2" />
//             </div>
//             <div className="md:w-2/3">
//               <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-300 text-white font-semibold px-5 py-2 rounded-tl-lg rounded-br-lg">
//                 <span className="text-black font-semibold">About</span>{' '}
//                 <span className="text-white font-medium">Dr. {doctorData.name}</span>
//               </span>
//               <div className="bg-white rounded-b px-2 py-2 border-l-2 border-blue-500">
//                 <p className="text-gray-700">{doctorData.about}</p>
//                 <div className="p-4">
//                   <div className="mt-4 flex flex-wrap gap-3">
//                     {Array.isArray(sections) && sections.length > 0 ? (
//                       sections.map((tab) => (
//                         <button
//                           key={tab.id}
//                           onClick={() => setSelectedTab(tab.section_type)}
//                           className={`${
//                             tab.section_type === selectedTab
//                               ? tab.section_type === 'experience'
//                                 ? 'bg-red-200 text-red-600'
//                                 : 'bg-blue-200 text-blue-600'
//                               : tab.section_type === 'experience'
//                               ? 'bg-red-100 text-red-500'
//                               : 'bg-blue-100 text-blue-500'
//                           } font-semibold px-4 py-1 rounded shadow cursor-pointer`}
//                         >
//                           {tab.section_type}
//                         </button>
//                       ))
//                     ) : (
//                       <p className="text-gray-500">No sections available</p>
//                     )}
//                   </div>
//                   <div className="flex flex-wrap gap-4 mt-4">
//                     {Array.isArray(sections) && sections.length > 0 ? (
//                       sections
//                         .filter((hosp) => hosp.section_type === selectedTab)
//                         .map((hosp, idx) => (
//                           <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
//                             <img src={hosp.image_url} alt={hosp.section_type} className="w-10 h-10 object-contain" />
//                             <span className="font-semibold">{hosp.section_type}</span>
//                           </div>
//                         ))
//                     ) : (
//                       <p className="text-gray-500">No affiliations available</p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="mt-3 flex gap-2">
//                   <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded">Consult Now</button>
//                   <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">Know More !</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
//           <h2 className="text-xl font-bold mb-4">Medical Expertise</h2>
//           <div className="flex flex-wrap gap-4">
//             {expertise.map((expert, idx) => (
//               <div key={idx} className="flex flex-col items-center w-32 bg-gray-50 rounded-lg py-2 shadow border">
//                 <img src={expert.image_url} alt="Expert" className="w-16 h-16 rounded-full object-cover mb-1" />
//                 <span className="font-semibold text-sm">Expert {idx + 1}</span>
//                 <span className="text-xs text-gray-500">{expert.description || 'Content'}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#f7fafd] min-h-screen font-sans">
//       <div className="max-w-6xl mx-auto py-10 px-14 flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-md mt-6">
//         <div className="flex-1 flex flex-col justify-center">
//           <h1 className="text-3xl font-bold text-blue-700">{doctorData.name}</h1>
//           <p className="text-lg text-gray-700">{doctorData.specialization}</p>
//           <p className="text-gray-500 font-semibold mt-1">{doctorData.experience_years}+ years of experience</p>
//           <q className="text-gray-600 italic block my-3">{doctorData.quote}</q>
//           <div className="flex flex-wrap items-center gap-4 mt-3">
//             <div className="flex items-center gap-2">
//               <FaHospitalAlt className="text-orange-500" />
//               <span className="font-medium">{doctorData.hospital}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaUsers className="text-blue-500" />
//               <span>{doctorData.total_patients}+ patients</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaCheckCircle className="text-green-600" />
//               <span className="text-green-700">{doctorData.status ? 'Available' : 'Not Available'}</span>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-3 mt-5">
//             <button
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 navigate(`/appointment/${doctorData.doctor_id}`);
//               }}
//             >
//               Book Appointment
//             </button>
//           </div>
//         </div>
//         <div className="hidden md:block">
//           <img src={doctorData.profile_img_right} alt="Doctor" className="w-56 h-[250px] object-cover rounded-lg shadow-lg" />
//         </div>
//       </div>
//       <div className="max-w-6xl mx-auto mt-4 flex flex-wrap gap-4 justify-center">
//         {[
//           { icon: <FaUserMd size={22} className="text-blue-500" />, label: doctorData.label1 },
//           { icon: <FaLanguage size={22} className="text-orange-500" />, label: doctorData.label2 },
//           { icon: <FaRegThumbsUp size={22} className="text-green-500" />, label: doctorData.label3 },
//         ].map((mode, idx) => (
//           <div key={idx} className="flex items-center gap-2 bg-white px-5 py-3 rounded-lg shadow border border-gray-100">
//             {mode.icon}
//             <span className="font-semibold text-gray-700">{mode.label}</span>
//           </div>
//         ))}
//       </div>
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
//         <div className="flex flex-col md:flex-row gap-8">
//           <div className="md:w-1/3 flex flex-col items-center">
//             <img src={doctorData.profile_img_left} alt="Doctor" className="w-44 h-44 rounded-lg object-cover mb-2" />
//           </div>
//           <div className="md:w-2/3">
//             <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-300 text-white font-semibold px-5 py-2 rounded-tl-lg rounded-br-lg">
//               <span className="text-black font-semibold">About</span>{' '}
//               <span className="text-white font-medium">Dr. {doctorData.name}</span>
//             </span>
//             <div className="bg-white rounded-b px-2 py-2 border-l-2 border-blue-500">
//               <p className="text-gray-700">{doctorData.about}</p>
//               <div className="p-4">
//                 <div className="mt-4 flex flex-wrap gap-3">
//                   {Array.isArray(sections) && sections.length > 0 ? (
//                     sections.map((tab) => (
//                       <button
//                         key={tab.id}
//                         onClick={() => setSelectedTab(tab.section_type)}
//                         className={`${
//                           tab.section_type === selectedTab
//                             ? tab.section_type === 'experience'
//                               ? 'bg-red-200 text-red-600'
//                               : 'bg-blue-200 text-blue-600'
//                             : tab.section_type === 'experience'
//                             ? 'bg-red-100 text-red-500'
//                             : 'bg-blue-100 text-blue-500'
//                         } font-semibold px-4 py-1 rounded shadow cursor-pointer`}
//                       >
//                         {tab.section_type}
//                       </button>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No sections available</p>
//                   )}
//                 </div>
//                 <div className="flex flex-wrap gap-4 mt-4">
//                   {Array.isArray(sections) && sections.length > 0 ? (
//                     sections
//                       .filter((hosp) => hosp.section_type === selectedTab)
//                       .map((hosp, idx) => (
//                         <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
//                           <img src={hosp.image_url} alt={hosp.section_type} className="w-10 h-10 object-contain" />
//                           <span className="font-semibold">{hosp.section_type}</span>
//                         </div>
//                       ))
//                   ) : (
//                     <p className="text-gray-500">No affiliations available</p>
//                   )}
//                 </div>
//               </div>
//               <div className="mt-3 flex gap-2">
//                 <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded">Consult Now</button>
//                 <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">Know More !</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
//         <h2 className="text-xl font-bold mb-3">Clinic Location</h2>
//         {clinics.map((loc, idx) => (
//           <div key={idx} className="flex flex-col md:flex-row gap-6">
//             <div className="flex-1">
//               <p className="font-bold">Fortis Hospital</p>
//               <div className="flex items-center gap-2 mt-1">
//                 <FaMapMarkerAlt className="text-red-500" />
//                 <span className="font-semibold">Address:</span>
//                 <span>{loc.address}</span>
//               </div>
//               <div className="flex items-center gap-2 mt-1">
//                 <MdLocationCity className="text-orange-500" />
//                 <span className="font-semibold">City:</span>
//                 <span>{loc.city}</span>
//               </div>
//               <button className="bg-red-100 text-red-600 font-semibold px-4 py-2 rounded shadow mt-3">Contact Now</button>
//             </div>
//             <div className="flex-1 flex justify-center">
//               <iframe
//                 src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.30966200977!2d${loc.longitude}!3d${loc.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91b9b6c2e3e7%3A0x2e2b0e1c8f3f3e53!2sKrishna%20Towers%2C%20Madhapur%2C%20Hyderabad%2C%20Telangana%20500081!5e0!3m2!1sen!2sin!4v1625582550000!5m2!1sen!2sin`}
//                 title="Clinic Location"
//                 width="350"
//                 height="200"
//                 className="rounded-md border"
//                 loading="lazy"
//               ></iframe>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="max-w-6xl mx-auto flex flex-wrap gap-6 mt-6">
//         {clinics.map((loc, idx) =>
//           loc.images && loc.images.length > 0 ? (
//             loc.images.map((image, imgIdx) => (
//               <img
//                 key={`${idx}-${imgIdx}`}
//                 src={image}
//                 alt={`Clinic ${idx + 1} Image ${imgIdx + 1}`}
//                 className="w-[48%] h-48 object-cover rounded-lg shadow"
//               />
//             ))
//           ) : (
//             <p key={idx} className="text-gray-500">No images available for Clinic {idx + 1}</p>
//           )
//         )}
//       </div>
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
//         <h2 className="text-xl font-bold mb-4">Medical Expertise</h2>
//         <div className="flex flex-wrap gap-4">
//           {expertise.map((expert, idx) => (
//             <div key={idx} className="flex flex-col items-center w-32 bg-gray-50 rounded-lg py-2 shadow border">
//               <img src={expert.image_url} alt="Expert" className="w-16 h-16 rounded-full object-cover mb-1" />
//               <span className="font-semibold text-sm">Expert {idx + 1}</span>
//               <span className="text-xs text-gray-500">{expert.description || 'Content'}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
//         <h2 className="text-xl font-bold mb-4">
//           Our Patients Feedback About <span className="text-blue-700">Dr {doctorData.name}</span>
//         </h2>
//         <div className="flex flex-wrap gap-6">
//           {reviews.map((feed, idx) => (
//             <div key={idx} className="flex-1 min-w-[250px] bg-gray-50 rounded-lg p-4 shadow border">
//               <div className="flex items-center gap-3 mb-2">
//                 <img
//                   src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
//                   alt={feed.patient_name}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <span className="font-bold">{feed.patient_name}</span>
//                 <span className="flex gap-1 ml-2">
//                   {[...Array(feed.rating)].map((_, i) => (
//                     <span key={i} className="text-yellow-400">★</span>
//                   ))}
//                 </span>
//               </div>
//               <p className="text-gray-600 text-sm">{feed.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#6ec1e4] via-[#b8d8f5] to-[#f7fafd] rounded-xl shadow-md p-6 mt-8">
//         <div className="flex flex-col md:flex-row gap-8 md:gap-6 items-center">
//           <div className="flex-[1.5] relative flex items-center min-h-[260px]">
//             <button
//               onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
//               className="absolute left-[-18px] md:left-[-30px] top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-10 border border-blue-200"
//               style={{ boxShadow: '0 2px 8px 0 rgba(52, 110, 208, 0.12)' }}
//             >
//               <ChevronLeft className="w-5 h-5 text-blue-700" />
//             </button>
//             <div ref={scrollRef} className="flex overflow-x-hidden gap-6 px-4 py-3" style={{ minWidth: 0 }}>
//               {[
//                 { author: 'Dr. Anita S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'Cardio' },
//                 { author: 'Dr. Anita S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'UX' },
//                 { author: 'Dr. James S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'Cardio' },
//               ].map((art, idx) => (
//                 <ArticleCard key={idx} art={art} idx={idx} isActive={idx === activeIndex} />
//               ))}
//             </div>
//             <button
//               onClick={() => setActiveIndex((prev) => Math.min(prev + 1, 2))}
//               className="absolute right-[-18px] md:right-[-30px] top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-10 border border-blue-200"
//               style={{ boxShadow: '0 2px 8px 0 rgba(52, 110, 208, 0.12)' }}
//             >
//               <ChevronRight className="w-5 h-5 text-blue-700" />
//             </button>
//           </div>
//           <div className="md:w-[350px] w-full mt-8 md:mt-0 flex flex-col items-center">
//             <h3 className="text-2xl font-bold mb-3 text-gray-900 text-center md:text-left">
//               Easy Steps and Get Your Solution
//             </h3>
//             <ul className="list-decimal list-inside text-base text-gray-700 mb-5 text-left">
//               {[
//                 'Identify the Issue',
//                 'Reach Out to the Expert',
//                 'Share Your Concerns',
//                 'Receive a Personalized Plan',
//                 'Follow Up and Stay Consistent',
//               ].map((step, idx) => (
//                 <li key={idx}>{step}</li>
//               ))}
//             </ul>
//             <div className="flex gap-3 w-full justify-center">
//               <button className="bg-yellow-500 hover:bg-yellow-500 text-white font-semibold px-5 py-1.5 rounded transition shadow">
//                 Read More !
//               </button>
//               <button className="bg-[#186cc3] hover:bg-[#1559a5] text-white font-semibold px-5 py-1.5 rounded transition shadow">
//                 Consult Later
//               </button>
//               <button className="bg-[#209c38] hover:bg-[#157a29] text-white font-semibold px-5 py-1.5 rounded transition shadow">
//                 Connect Now !
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 mt-8 mb-10">
//         <div className="flex-1">
//           <h3 className="font-bold mb-2">Dr {doctorData.name}'s Intro</h3>
//           <div className="aspect-w-16 aspect-h-9">
//             <iframe
//               src={videos[0]?.video_url.replace('watch?v=', 'embed/')}
//               title={`Dr ${doctorData.name}'s Intro`}
//               width="100%"
//               height="215"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               className="rounded-lg shadow"
//             />
//           </div>
//         </div>
//         <div className="flex-1">
//           <h3 className="font-bold mb-2 flex items-center gap-2">
//             <FaRegCommentDots className="text-red-500" /> Health and Tips
//           </h3>
//           <div className="flex gap-3">
//             {videos.map((tip, idx) => (
//               <div key={idx} className="bg-white rounded-lg shadow border w-32 p-2">
//                 <img
//                   src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
//                   alt="Health Tip"
//                   className="w-full h-16 rounded object-cover mb-1"
//                 />
//                 <div className="text-xs font-semibold">Health Tip {idx + 1}</div>
//                 <div className="text-[10px] text-gray-400">2.{idx + 4}M Views</div>
//                 <button className="bg-yellow-400 text-white px-2 py-1 rounded text-xs mt-2">Watch More!</button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorPortfolio;


import React, { useRef, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaHospitalAlt, FaCheckCircle, FaMapMarkerAlt, FaUserMd, FaLanguage, FaRegThumbsUp, FaUsers, FaRegCommentDots } from 'react-icons/fa';
import { MdLocationCity } from 'react-icons/md';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const DoctorPortfolio = () => {
  const { doctor_id } = useParams();
  const location = useLocation();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [doctorData, setDoctorData] = useState(null);
  const [sections, setSections] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('experience');
  const navigate = useNavigate();

  const isPortfolioRoute = location.pathname.includes('/portfolio');

  const scrollToCard = (index) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = 320 + 24;
    const centerOffset = (container.offsetWidth - cardWidth) / 2;
    container.scrollTo({
      left: index * cardWidth - centerOffset,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToCard(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctor_id) {
        setError('Doctor ID is missing in the URL.');
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };

        setError(null);
        const [doctorRes, sectionsRes, clinicsRes, expertiseRes, reviewsRes, videosRes] = await Promise.all([
          axios.get(`https://api.onestepmedi.com:8000/doctors/${doctor_id}`, config),
          axios.get(`https://api.onestepmedi.com:8000/doctors/sections/${doctor_id}`, config),
          axios.get(`https://api.onestepmedi.com:8000/doctors/clinics/${doctor_id}`, config),
          axios.get(`https://api.onestepmedi.com:8000/doctors/expertise/${doctor_id}`, config),
          axios.get(`https://api.onestepmedi.com:8000/doctors/reviews/${doctor_id}`, config),
          axios.get(`https://api.onestepmedi.com:8000/doctors/videos/${doctor_id}`, config),
        ]);

        setDoctorData(doctorRes.data);
        setSections(Array.isArray(sectionsRes.data) ? sectionsRes.data : []);
        setClinics(clinicsRes.data);
        setExpertise(expertiseRes.data);
        setReviews(reviewsRes.data || []); // Ensure reviews is always an array
        setVideos(videosRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to fetch doctor data: ${error.message}`);
        setSections([]);
        setReviews([]); // Reset reviews on error
      }
    };

    fetchDoctorData();
  }, [doctor_id]);

  const ArticleCard = ({ art, idx, isActive }) => (
    <div
      className={`w-[320px] shrink-0 rounded-xl shadow transition-transform duration-300 p-0 border-0 bg-white/70 flex flex-col h-[220px] relative ${
        isActive ? 'scale-105 z-10' : 'scale-95 opacity-80'
      }`}
      style={{
        borderRadius: 18,
        boxShadow: isActive ? '0 4px 24px 0 rgba(52, 110, 208, 0.13)' : '0 1px 6px 0 rgba(52, 110, 208, 0.06)',
        border: 'none',
      }}
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <img
          src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
          alt="author"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <span className="text-xs font-bold text-gray-800">{art.author || 'Dr. Anita S'}</span>
          <p className="text-[11px] text-gray-400 pt-0.5">17 hours ago</p>
        </div>
        <span className="ml-auto">
          <span className="inline-flex items-center text-xs font-bold px-2 py-1 rounded-full bg-[#FFB800]/20 text-[#FFB800]">
            {art.tag || 'Cardio'}
          </span>
        </span>
      </div>
      <img
        src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
        alt="article visual"
        className="mx-4 mt-1 mb-2 rounded-lg object-cover h-[70px] w-[95%]"
      />
      <div className="px-4">
        <p className="font-semibold text-[15px] leading-snug mb-0 text-gray-800">{art.title || '10 Early Signs of Heart Disease'}</p>
        <p className="text-xs text-gray-500 mb-2">{art.desc || 'When I was studying...'}</p>
      </div>
    </div>
  );

  if (error) return <div className="text-red-600 text-center p-6">{error}</div>;
  if (!doctorData) return <div className="text-gray-600 text-center p-6">Loading...</div>;

  if (isPortfolioRoute) {
    return (
      <div className="bg-[#f7fafd] min-h-screen font-sans">
        <div className="max-w-6xl mx-auto py-10 px-14 flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-md mt-6">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-blue-700">{doctorData.name}'s Portfolio</h1>
            <p className="text-lg text-gray-700">{doctorData.specialization}</p>
            <p className="text-gray-500 font-semibold mt-1">{doctorData.experience_years}+ years of experience</p>
            <q className="text-gray-600 italic block my-3">{doctorData.quote}</q>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <FaHospitalAlt className="text-orange-500" />
                <span className="font-medium">{doctorData.hospital}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-500" />
                <span>{doctorData.total_patients}+ patients</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span className="text-green-700">{doctorData.status ? 'Available' : 'Not Available'}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <img src={doctorData.profile_img_right} alt="Doctor" className="w-56 h-[250px] object-cover rounded-lg shadow-lg" />
          </div>
        </div>

        {/* New row for labels between first and second section */}
        <div className="max-w-6xl mx-auto px-14 py-4 bg-gray-50 flex flex-wrap gap-4 justify-center">
          {doctorData.label1 && (
            <div className="bg-blue-100 text-blue-800 p-2 rounded flex items-center gap-2">
              <FaHospitalAlt className="text-orange-500" />
              <span><strong>Clinic:</strong> {doctorData.label1}</span>
            </div>
          )}
          {doctorData.label2 && (
            <div className="bg-blue-100 text-blue-800 p-2 rounded flex items-center gap-2">
              <FaLanguage className="text-green-500" />
              <span><strong>Language:</strong> {doctorData.label2}</span>
            </div>
          )}
          {doctorData.label3 && (
            <div className="bg-blue-100 text-blue-800 p-2 rounded flex items-center gap-2">
              <FaRegThumbsUp className="text-yellow-500" />
              <span><strong>Recommendations:</strong> {doctorData.label3}</span>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col items-center">
              <img src={doctorData.profile_img_left} alt="Doctor" className="w-44 h-44 rounded-lg object-cover mb-2" />
            </div>
            <div className="md:w-2/3">
              <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-300 text-white font-semibold px-5 py-2 rounded-tl-lg rounded-br-lg">
                <span className="text-black font-semibold">About</span>{' '}
                <span className="text-white font-medium">Dr. {doctorData.name}</span>
              </span>
              <div className="bg-white rounded-b px-2 py-2 border-l-2 border-blue-500">
                <p className="text-gray-700">{doctorData.about}</p>
                <div className="p-4">
                  <div className="mt-4 flex flex-wrap gap-3">
                    {Array.isArray(sections) && sections.length > 0 ? (
                      sections.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedTab(tab.section_type)}
                          className={`${
                            tab.section_type === selectedTab
                              ? tab.section_type === 'experience'
                                ? 'bg-red-200 text-red-600'
                                : 'bg-blue-200 text-blue-600'
                              : tab.section_type === 'experience'
                              ? 'bg-red-100 text-red-500'
                              : 'bg-blue-100 text-blue-500'
                          } font-semibold px-4 py-1 rounded shadow cursor-pointer`}
                        >
                          {tab.section_type}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500">No sections available</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {Array.isArray(sections) && sections.length > 0 ? (
                      sections
                        .filter((hosp) => hosp.section_type === selectedTab)
                        .map((hosp, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
                            <img src={hosp.image_url} alt={hosp.section_type} className="w-10 h-10 object-contain" />
                            <span className="font-semibold">{hosp.section_type}</span>
                          </div>
                        ))
                    ) : (
                      <p className="text-gray-500">No affiliations available</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded">Consult Now</button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">Know More !</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Medical Expertise</h2>
          <div className="flex flex-wrap gap-4">
            {expertise.map((expert, idx) => (
              <div key={idx} className="flex flex-col items-center w-32 bg-gray-50 rounded-lg py-2 shadow border">
                <img src={expert.image_url} alt="Expert" className="w-16 h-16 rounded-full object-cover mb-1" />
                <span className="font-semibold text-sm">Expert {idx + 1}</span>
                <span className="text-xs text-gray-500">{expert.description || 'Content'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold mb-3">Clinic Location</h2>
          {clinics.map((loc, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="font-bold">Clinic {idx + 93}</p>
                <div className="flex items-center gap-2 mt-1">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span className="font-semibold">Address:</span>
                  <span>{loc.address}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <MdLocationCity className="text-orange-500" />
                  <span className="font-semibold">City:</span>
                  <span>{loc.city}</span>
                </div>
                <button className="bg-red-100 text-red-600 font-semibold px-4 py-2 rounded shadow mt-3">Contact Now</button>
              </div>
              <div className="flex-1 flex justify-center">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.30966200977!2d${loc.longitude}!3d${loc.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91b9b6c2e3e7%3A0x2e2b0e1c8f3f3e53!2sKrishna%20Towers%2C%20Madhapur%2C%20Hyderabad%2C%20Telangana%20500081!5e0!3m2!1sen!2sin!4v1625582550000!5m2!1sen!2sin`}
                  title="Clinic Location"
                  width="350"
                  height="200"
                  className="rounded-md border"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-6 mt-6">
          {clinics.map((loc, idx) =>
            loc.images && loc.images.length > 0 ? (
              loc.images.map((image, imgIdx) => (
                <img
                  key={`${idx}-${imgIdx}`}
                  src={image}
                  alt={`Clinic ${idx + 93} Image ${imgIdx + 1}`}
                  className="w-[48%] h-48 object-cover rounded-lg shadow"
                />
              ))
            ) : (
              <p key={idx} className="text-gray-500">No images available for Clinic {idx + 93}</p>
            )
          )}
        </div>
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">
            Our Patients Feedback About <span className="text-blue-700">Dr {doctorData.name}</span>
          </h2>
          <div className="flex flex-wrap gap-6">
            {reviews.map((feed, idx) => (
              <div key={idx} className="flex-1 min-w-[250px] bg-gray-50 rounded-lg p-4 shadow border">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
                    alt={feed.patient_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-bold">{feed.patient_name}</span>
                  <span className="flex gap-1 ml-2">
                    {[...Array(feed.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{feed.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#6ec1e4] via-[#b8d8f5] to-[#f7fafd] rounded-xl shadow-md p-6 mt-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-6 items-center">
            <div className="flex-[1.5] relative flex items-center min-h-[260px]">
              <button
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                className="absolute left-[-18px] md:left-[-30px] top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-10 border border-blue-200"
                style={{ boxShadow: '0 2px 8px 0 rgba(52, 110, 208, 0.12)' }}
              >
                <ChevronLeft className="w-5 h-5 text-blue-700" />
              </button>
              <div ref={scrollRef} className="flex overflow-x-hidden gap-6 px-4 py-3" style={{ minWidth: 0 }}>
                {[
                  { author: 'Dr. Anita S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'Cardio' },
                  { author: 'Dr. Anita S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'UX' },
                  { author: 'Dr. James S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'Cardio' },
                ].map((art, idx) => (
                  <ArticleCard key={idx} art={art} idx={idx} isActive={idx === activeIndex} />
                ))}
              </div>
              <button
                onClick={() => setActiveIndex((prev) => Math.min(prev + 1, 2))}
                className="absolute right-[-18px] md:right-[-30px] top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-10 border border-blue-200"
                style={{ boxShadow: '0 2px 8px 0 rgba(52, 110, 208, 0.12)' }}
              >
                <ChevronRight className="w-5 h-5 text-blue-700" />
              </button>
            </div>
            <div className="md:w-[350px] w-full mt-8 md:mt-0 flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 text-center md:text-left">
                Easy Steps and Get Your Solution
              </h3>
              <ul className="list-decimal list-inside text-base text-gray-700 mb-5 text-left">
                {[
                  'Identify the Issue',
                  'Reach Out to the Expert',
                  'Share Your Concerns',
                  'Receive a Personalized Plan',
                  'Follow Up and Stay Consistent',
                ].map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
              <div className="flex gap-3 w-full justify-center">
                <button className="bg-yellow-500 hover:bg-yellow-500 text-white font-semibold px-5 py-1.5 rounded transition shadow">
                  Read More !
                </button>
                <button className="bg-[#186cc3] hover:bg-[#1559a5] text-white font-semibold px-5 py-1.5 rounded transition shadow">
                  Consult Later
                </button>
                <button className="bg-[#209c38] hover:bg-[#157a29] text-white font-semibold px-5 py-1.5 rounded transition shadow">
                  Connect Now !
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 mt-8 mb-10">
          <div className="flex-1">
            <h3 className="font-bold mb-2">Dr {doctorData.name}'s Intro</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={videos.length > 0 && videos[0]?.video_url ? videos[0].video_url.replace('watch?v=', 'embed/') : 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title={`Dr ${doctorData.name}'s Intro`}
                width="100%"
                height="215"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow"
              />
              {videos.length === 0 && <p className="text-red-500 text-sm mt-2">No video available</p>}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <FaRegCommentDots className="text-red-500" /> Health and Tips
            </h3>
            <div className="flex gap-3">
              {videos.map((tip, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow border w-32 p-2">
                  <img
                    src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
                    alt="Health Tip"
                    className="w-full h-16 rounded object-cover mb-1"
                  />
                  <div className="text-xs font-semibold">Health Tip {idx + 1}</div>
                  <div className="text-[10px] text-gray-400">2.{idx + 4}M Views</div>
                  <button className="bg-yellow-400 text-white px-2 py-1 rounded text-xs mt-2">Watch More!</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7fafd] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto py-10 px-14 flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-md mt-6">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-blue-700">{doctorData.name}</h1>
          <p className="text-lg text-gray-700">{doctorData.specialization}</p>
          <p className="text-gray-500 font-semibold mt-1">{doctorData.experience_years}+ years of experience</p>
          <q className="text-gray-600 italic block my-3">{doctorData.quote}</q>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <FaHospitalAlt className="text-orange-500" />
              <span className="font-medium">{doctorData.hospital}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-blue-500" />
              <span>{doctorData.total_patients}+ patients</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              <span className="text-green-700">{doctorData.status ? 'Available' : 'Not Available'}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/appointment/${doctorData.doctor_id}`);
              }}
            >
              Book Appointment
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <img src={doctorData.profile_img_right} alt="Doctor" className="w-56 h-[250px] object-cover rounded-lg shadow-lg" />
        </div>
      </div>

      {/* New row for labels between first and second section */}
      <div className="max-w-6xl mx-auto px-14 py-4 bg-gray-50 flex flex-wrap gap-4 justify-center">
        {doctorData.label1 && (
          <div className="bg-blue-100 text-blue-800 p-2 rounded flex items-center gap-2">
            <FaHospitalAlt className="text-orange-500" />
            <span><strong>Clinic:</strong> {doctorData.label1}</span>
          </div>
        )}
        {doctorData.label2 && (
          <div className="bg-blue-100 text-blue-800 p-2 rounded flex items-center gap-2">
            <FaLanguage className="text-green-500" />
            <span><strong>Language:</strong> {doctorData.label2}</span>
          </div>
        )}
        {doctorData.label3 && (
          <div className="bg-blue-100 text-blue-800 p-2 rounded flex items-center gap-2">
            <FaRegThumbsUp className="text-yellow-500" />
            <span><strong>Recommendations:</strong> {doctorData.label3}</span>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 flex flex-col items-center">
            <img src={doctorData.profile_img_left} alt="Doctor" className="w-44 h-44 rounded-lg object-cover mb-2" />
          </div>
          <div className="md:w-2/3">
            <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-300 text-white font-semibold px-5 py-2 rounded-tl-lg rounded-br-lg">
              <span className="text-black font-semibold">About</span>{' '}
              <span className="text-white font-medium">Dr. {doctorData.name}</span>
            </span>
            <div className="bg-white rounded-b px-2 py-2 border-l-2 border-blue-500">
              <p className="text-gray-700">{doctorData.about}</p>
              <div className="p-4">
                <div className="mt-4 flex flex-wrap gap-3">
                  {Array.isArray(sections) && sections.length > 0 ? (
                    sections.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.section_type)}
                        className={`${
                          tab.section_type === selectedTab
                            ? tab.section_type === 'experience'
                              ? 'bg-red-200 text-red-600'
                              : 'bg-blue-200 text-blue-600'
                            : tab.section_type === 'experience'
                            ? 'bg-red-100 text-red-500'
                            : 'bg-blue-100 text-blue-500'
                        } font-semibold px-4 py-1 rounded shadow cursor-pointer`}
                      >
                        {tab.section_type}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500">No sections available</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  {Array.isArray(sections) && sections.length > 0 ? (
                    sections
                      .filter((hosp) => hosp.section_type === selectedTab)
                      .map((hosp, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
                          <img src={hosp.image_url} alt={hosp.section_type} className="w-10 h-10 object-contain" />
                          <span className="font-semibold">{hosp.section_type}</span>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500">No affiliations available</p>
                  )}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded">Consult Now</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">Know More !</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-3">Clinic Location</h2>
        {clinics.map((loc, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <p className="font-bold">Clinic {idx + 93}</p>
              <div className="flex items-center gap-2 mt-1">
                <FaMapMarkerAlt className="text-red-500" />
                <span className="font-semibold">Address:</span>
                <span>{loc.address}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MdLocationCity className="text-orange-500" />
                <span className="font-semibold">City:</span>
                <span>{loc.city}</span>
              </div>
              <button className="bg-red-100 text-red-600 font-semibold px-4 py-2 rounded shadow mt-3">Contact Now</button>
            </div>
            <div className="flex-1 flex justify-center">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.30966200977!2d${loc.longitude}!3d${loc.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91b9b6c2e3e7%3A0x2e2b0e1c8f3f3e53!2sKrishna%20Towers%2C%20Madhapur%2C%20Hyderabad%2C%20Telangana%20500081!5e0!3m2!1sen!2sin!4v1625582550000!5m2!1sen!2sin`}
                title="Clinic Location"
                width="350"
                height="200"
                className="rounded-md border"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto flex flex-wrap gap-6 mt-6">
        {clinics.map((loc, idx) =>
          loc.images && loc.images.length > 0 ? (
            loc.images.map((image, imgIdx) => (
              <img
                key={`${idx}-${imgIdx}`}
                src={image}
                alt={`Clinic ${idx + 93} Image ${imgIdx + 1}`}
                className="w-[48%] h-48 object-cover rounded-lg shadow"
              />
            ))
          ) : (
            <p key={idx} className="text-gray-500">No images available for Clinic {idx + 93}</p>
          )
        )}
      </div>
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Medical Expertise</h2>
        <div className="flex flex-wrap gap-4">
          {expertise.map((expert, idx) => (
            <div key={idx} className="flex flex-col items-center w-32 bg-gray-50 rounded-lg py-2 shadow border">
              <img src={expert.image_url} alt="Expert" className="w-16 h-16 rounded-full object-cover mb-1" />
              <span className="font-semibold text-sm">Expert {idx + 1}</span>
              <span className="text-xs text-gray-500">{expert.description || 'Content'}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">
          Our Patients Feedback About <span className="text-blue-700">Dr {doctorData.name}</span>
        </h2>
        <div className="flex flex-wrap gap-6">
          {reviews.map((feed, idx) => (
            <div key={idx} className="flex-1 min-w-[250px] bg-gray-50 rounded-lg p-4 shadow border">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
                  alt={feed.patient_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-bold">{feed.patient_name}</span>
                <span className="flex gap-1 ml-2">
                  {[...Array(feed.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{feed.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#6ec1e4] via-[#b8d8f5] to-[#f7fafd] rounded-xl shadow-md p-6 mt-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 items-center">
          <div className="flex-[1.5] relative flex items-center min-h-[260px]">
            <button
              onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
              className="absolute left-[-18px] md:left-[-30px] top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-10 border border-blue-200"
              style={{ boxShadow: '0 2px 8px 0 rgba(52, 110, 208, 0.12)' }}
            >
              <ChevronLeft className="w-5 h-5 text-blue-700" />
            </button>
            <div ref={scrollRef} className="flex overflow-x-hidden gap-6 px-4 py-3" style={{ minWidth: 0 }}>
              {[
                { author: 'Dr. Anita S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'Cardio' },
                { author: 'Dr. Anita S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'UX' },
                { author: 'Dr. James S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'Cardio' },
              ].map((art, idx) => (
                <ArticleCard key={idx} art={art} idx={idx} isActive={idx === activeIndex} />
              ))}
            </div>
            <button
              onClick={() => setActiveIndex((prev) => Math.min(prev + 1, 2))}
              className="absolute right-[-18px] md:right-[-30px] top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-10 border border-blue-200"
              style={{ boxShadow: '0 2px 8px 0 rgba(52, 110, 208, 0.12)' }}
            >
              <ChevronRight className="w-5 h-5 text-blue-700" />
            </button>
          </div>
          <div className="md:w-[350px] w-full mt-8 md:mt-0 flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-3 text-gray-900 text-center md:text-left">
              Easy Steps and Get Your Solution
            </h3>
            <ul className="list-decimal list-inside text-base text-gray-700 mb-5 text-left">
              {[
                'Identify the Issue',
                'Reach Out to the Expert',
                'Share Your Concerns',
                'Receive a Personalized Plan',
                'Follow Up and Stay Consistent',
              ].map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
            <div className="flex gap-3 w-full justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-500 text-white font-semibold px-5 py-1.5 rounded transition shadow">
                Read More !
              </button>
              <button className="bg-[#186cc3] hover:bg-[#1559a5] text-white font-semibold px-5 py-1.5 rounded transition shadow">
                Consult Later
              </button>
              <button className="bg-[#209c38] hover:bg-[#157a29] text-white font-semibold px-5 py-1.5 rounded transition shadow">
                Connect Now !
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 mt-8 mb-10">
        <div className="flex-1">
          <h3 className="font-bold mb-2">Dr {doctorData.name}'s Intro</h3>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={videos.length > 0 && videos[0]?.video_url ? videos[0].video_url.replace('watch?v=', 'embed/') : 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
              title={`Dr ${doctorData.name}'s Intro`}
              width="100%"
              height="215"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow"
            />
            {videos.length === 0 && <p className="text-red-500 text-sm mt-2">No video available</p>}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <FaRegCommentDots className="text-red-500" /> Health and Tips
          </h3>
          <div className="flex gap-3">
            {videos.map((tip, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow border w-32 p-2">
                <img
                  src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
                  alt="Health Tip"
                  className="w-full h-16 rounded object-cover mb-1"
                />
                <div className="text-xs font-semibold">Health Tip {idx + 1}</div>
                <div className="text-[10px] text-gray-400">2.{idx + 4}M Views</div>
                <button className="bg-yellow-400 text-white px-2 py-1 rounded text-xs mt-2">Watch More!</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPortfolio;