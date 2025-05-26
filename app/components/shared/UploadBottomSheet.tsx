/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useRef, useState } from 'react';
import { AddBiographyIcon, AddPhotoIcon, HideProfileIcon, LoadCollectionIcon, LoadProfileImageIcon, NewCollectionIcon } from '../icons/icons';
import { ToggleSwitch } from './Toggle';
import { useRouter } from 'next/router';
import AnimatedDiv from './AnimetedDiv';
import { useAuthContext } from '@/app/context/AuthContext';
import { useAppContext } from '@/app/context/AppContext';
import { onSubmit } from '@/actions';
import Image from "next/image"
import UploadProgressPopUp from '../profile/ProgressBar';
import SavedSuccessfull from '../profile/SavedSuccessful';

// // Componente per il popup premium
// const PremiumPopup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center"
//             onClick={onClose}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 25 }}
//               className="relative bg-black text-white rounded-xl shadow-lg z-[10000] w-[90%] max-w-md mx-auto overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Sfondo con immagine e overlay gradiente */}
//               <div className="absolute inset-0 z-0">
//                 <div 
//                   className="absolute inset-0 bg-cover bg-center" 
//                   style={{ 
//                     backgroundImage: "url('https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?q=80&w=1000&auto=format&fit=crop')",
//                     opacity: 0.4
//                   }}
//                 ></div>
//                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/60"></div>
//               </div>

//               {/* Contenuto del popup */}
//               <div className="relative z-10 p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <div className="flex items-center">
//                     <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-1.5 rounded-full">
//                       <PremiumIcon />
//                     </div>
//                     <h2 className="text-xl font-bold ml-3 text-white">Profilo Sportivo Premium</h2>
//                   </div>
//                   <div 
//                     onClick={onClose} 
//                     className="cursor-pointer bg-black/30 hover:bg-black/50 transition-colors p-1.5 rounded-full"
//                   >
//                     <CloseIcon width={24} height={24} />
//                   </div>
//                 </div>

//                 <div className="mb-7 text-center">
//                   <p className="text-lg mb-5 font-medium">Nascondi il tuo profilo con la modalità Anonimo e ottieni:</p>
//                   <ul className="space-y-4 text-left max-w-xs mx-auto">
//                     <li className="flex items-start bg-black/20 p-3 rounded-lg">
//                       <div className="bg-[#2195F2] text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">✓</div>
//                       <span className="opacity-90">Gli osservatori del proprio profilo</span>
//                     </li>
//                     <li className="flex items-start bg-black/20 p-3 rounded-lg">
//                       <div className="bg-[#2195F2] text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">✓</div>
//                       <span className="opacity-90">Accesso modalità Anonimo illimitatamente</span>
//                     </li>
//                     <li className="flex items-start bg-black/20 p-3 rounded-lg">
//                       <div className="bg-[#2195F2] text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">✓</div>
//                       <span className="opacity-90">Maggiore opportunità calcistiche</span>
//                     </li>
//                   </ul>
//                 </div>

//                 <div className="bg-[#2195F2]/10 backdrop-blur-sm p-4 rounded-lg mb-6 mx-auto border border-[#2195F2]/20">
//                   <div className="flex flex-col items-center">
//                     <span className="line-through text-gray-400 mb-1">1,99€ al mese</span>
//                     <span className="text-[#2195F2] font-bold text-xl">GRATIS come benvenuto</span>
//                   </div>
//                 </div>

//                 <button 
//                   className="w-full bg-gradient-to-r from-[#1e88e5] to-[#2195F2] text-white py-3.5 rounded-lg font-bold mb-3 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
//                   onClick={onClose}
//                 >
//                   Attiva Premium
//                 </button>

//                 <p className="text-xs text-center text-gray-400 mt-4">
//                   Abbonamento 1,99€ al mese. Disattivazione in qualsiasi momento.
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };
const UploadBottomSheet: React.FC = () => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const { user, setUser } = useAuthContext()
  const { editUser } = useAppContext()

  const handleAnonymousToggle = async () => {
    if (user.hidden) {
      setUser({ ...user, hidden: false });
      await editUser({ ...user, hidden: false })

    } else {
      setUser({ ...user, hidden: true });
      await editUser({ ...user, hidden: true })

    }
    console.log('Modalità anonimo:', !user.hidden ? 'attivata' : 'disattivata');
  };

  const handleGoToProfileParagraph = () => {
    setSelectedOption('video');
    console.log('Carica video raccolte');
    router.push('/myprofile');

    // Quando la route cambia, scrolliamo
    const handleRouteChange = () => {
      const element = document.getElementById('collections');
      console.log("cambiata")
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      // Importantissimo: togliamo il listener dopo
      router.events.off('routeChangeComplete', handleRouteChange);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
  };

    const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
    const [presentationFile, setPresentationFile] = useState<string>("");
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadCompleted, setUploadCompleted] = useState(false);
    useEffect(() => {
      if (uploadProgress === 100 && presentationFile != "" && user.name != "") {
        setUploadCompleted(true);
        setTimeout(async () => {
          setUploadCompleted(false);
          console.log(presentationFile)
          const response = await editUser({ ...user, profileImage: presentationFile });
          
          router.push("/teammessage");
        }, 3000);
      }
    }, [uploadProgress, presentationFile]);
 const fileInputRef = useRef(null);
  const handleEditClick = () => {
    //@ts-ignore
    fileInputRef.current?.click();
    setIsLoadingPhoto(true)
  };
const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const startTime = performance.now(); // Inizio timer

        const url = await onSubmit(formData, (progressEvent: ProgressEvent) => {
            if (progressEvent.total && progressEvent.loaded) {
                const percent = (progressEvent.loaded / progressEvent.total) * 100;
                setUploadProgress(percent);
            }
        }, async (fileUrl: string) => {
          setIsLoadingPhoto(false)
            if (fileType.startsWith("image/")) {
              await editUser({
                ...user,
                presentationImage: fileUrl,
                    presentationVideo: "." // Forziamo la rimozione dell'immagine
              })
                await setUser(prevUser => ({
                    ...prevUser,
                    presentationImage: fileUrl,
                    presentationVideo: "." // Forziamo la rimozione del video
                }));
                console.log("Immagine caricata con successo.");
            } else if (fileType.startsWith("video/")) {
              await editUser({
                ...user,
                    presentationVideo: fileUrl,
                    presentationImage: "." // Forziamo la rimozione dell'immagine
              })
                await setUser(prevUser => ({
                    ...prevUser,
                    presentationVideo: fileUrl,
                    presentationImage: "." // Forziamo la rimozione dell'immagine
                }));
                
                console.log("Video caricato con successo.");
            } else {
                console.log("Formato non supportato.");
            }

        });
        console.log(url);
        const endTime = performance.now(); // Fine timer
        const elapsedTime = ((endTime - startTime) / 1000).toFixed(2); // Tempo in secondi
        const fileType = file.type;

    };

  const router = useRouter();
  return (
    <>
      <div className="flex flex-col gap-[5px] pl-[9px] pr-[16px] mt-5">

        {/* Carica video raccolte */}
        <div
          onClick={handleGoToProfileParagraph}
          className={`w-full px-4 py-4 ${selectedOption === 'video' ? "bg-[#2195F20D] text-[#2195F2]" : "bg-[#FFFFFF0A] text-white"} rounded-md focus:outline-none focus:border-gray-500 focus:border-[1px] border-[1px] border-transparent flex items-center gap-3 mb-2 relative`}
        >
          <div className={`w-8 h-8 rounded-full ${selectedOption === 'video' ? "bg-[#2195F20D]" : "bg-[#FFFFFF0A]"} flex items-center justify-center`}>
            <LoadCollectionIcon width={31} height={27} color={selectedOption === 'video' ? "#2195F2" : "white"} />
          </div>
          <span className="flex-grow">Carica video raccolte</span>
        </div>

        {/* Carica Copertina */}
              <UploadProgressPopUp uploadProgress={uploadProgress} setUploadProgress={setUploadProgress} />
              <SavedSuccessfull isVisible={uploadCompleted} text="File caricato con successo!" />
        <AnimatedDiv clickablePart={
          <div
            onClick={() => {
              setSelectedOption('cover');
              console.log('Carica Copertina');
            }}
            className={`w-full px-4 py-4 ${selectedOption === 'cover' ? "bg-[#2195F20D] text-[#2195F2]" : "bg-[#FFFFFF0A] text-white"} rounded-md focus:outline-none focus:border-gray-500 focus:border-[1px] border-[1px] border-transparent flex items-center gap-3 mb-2 relative`}
          >
            <div className={`w-8 h-8 rounded-[10px] ${selectedOption === 'cover' ? "bg-[#2195F20D]" : "bg-[#FFFFFF0A]"} flex items-center justify-center`}>
              <LoadProfileImageIcon width={25} height={30} color={selectedOption === 'cover' ? "#2195F2" : "white"} />
            </div>
            <span className="flex-grow">Carica Copertina</span>
          </div>
        } navText='Copertina'>
            <>
            <p className='text-[#515151] mt-2 px-[20px] text-[19px]'>Inserisci un’immagine o un breve video d’impatto da mettere in evidenza sul tuo profilo.</p>
        <div className='w-[30%] h-[230px] text-[50px] rounded-[10px] flex items-center justify-center mx-auto mt-[8px]' onClick={handleEditClick}>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />

          {user.presentationImage || user.presentationVideo ? <div className="relative">
  <div className="p-3 border-2 border-white rounded-full w-max absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  <NewCollectionIcon width={22} height={22} color='white' />
  </div>


  {user.presentationImage && user.presentationImage !== "." ? (
    <Image
      src={user.presentationImage}
      width={200}
      height={200}
      alt="Profile Image"
      className="object-cover z-10 h-[222px] border-4 border-primary rounded-[10px]"
    />
  ) : (
    <video
      src={user.presentationVideo}
      width={200}
      height={200}
      className="object-cover z-10 h-[222px] border-4 border-primary rounded-[10px]"
      autoPlay
      loop
      muted
      playsInline
    />
  )}
            </div> : isLoadingPhoto ? <p className='text-[19px]'>Caricamento...</p> : <AddPhotoIcon width={102} height={102} />}
          </div>
            </>
        </AnimatedDiv>

        {/* Nascondi profilo */}
        <AnimatedDiv clickablePart={
          <div
            onClick={handleAnonymousToggle}
            className={`w-full px-4 py-4 ${user.hidden ? "bg-[#2195F20D] text-[#2195F2]" : "bg-[#FFFFFF0A] text-white"} rounded-md focus:outline-none focus:border-gray-500 focus:border-[1px] border-[1px] border-transparent flex items-center gap-3 mb-2 relative`}
          >
            <div className={`w-8 h-8 rounded-full ${user.hidden ? "bg-[#2195F20D]" : "bg-[#FFFFFF0A]"} flex items-center justify-center`}>
              <HideProfileIcon width={32} height={21} color={user.hidden ? "#2195F2" : "white"} />
            </div>
            <span className="flex-grow">{user.hidden ? 'Nascondi profilo attivato' : 'Nascondi profilo'}</span>
            <div className="absolute right-4">
              <ToggleSwitch enabled={user.hidden} setEnabled={handleAnonymousToggle} />
            </div>
          </div>
        } navText=' '>
          {user.hidden ?
            <>
              <HideProfileIcon width={82} height={53} className='mx-auto mt-2' />
              <h1 className='w-full text-center text-[24px] mt-[18px]'>Nome Nascosto</h1>
              <p className='text-[#515151] text-center text-[19px] mt-[18px]'>Il tuo profilo rimane sempre visibile ma nessuno potrà sapere il tuo nome.</p>
            </> :
            <>
              <HideProfileIcon width={82} height={53} className='mx-auto mt-2' />
              <h1 className='w-full text-center text-[24px] mt-[18px]'>Nome Pubblico</h1>
              <p className='text-[#515151] text-center text-[19px] mt-[18px]'>Il tuo nome è pubblico.</p>
            </>
          }
        </AnimatedDiv>

      </div>
    </>
  );
};

export default UploadBottomSheet;
