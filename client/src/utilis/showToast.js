import { toast,Bounce } from "react-toastify";

export const showToast=(alertType,alertMessage)=>{
    if(alertType=='success')
    {
        toast.success(alertMessage, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
    }
}