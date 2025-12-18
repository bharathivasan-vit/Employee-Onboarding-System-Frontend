import Swal from "sweetalert2";

const UseAlert = () => {
    const showButtonAlert = async ({
    title = "Are you sure?",
    text = "You won't be able to revert this!",
    icon = "warning",
    confirmButtonText = "OK",
  }) => {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText,
      confirmButtonColor: "#2c476d",
      position: "center",
    });
  };

  const showConfirm = async ({
    title = "Are you sure?",
    text = "You won't be able to revert this!",
    icon = "warning",
    confirmButtonText = "Yes",
    cancelButtonText = "Cancel",
  }) => {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: "#2c476d",
      cancelButtonColor: "#c90202",
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
    });

    return result.isConfirmed;
  };


  const showSuccess = (message = "Action completed successfully!", title = "Success") => {
    Swal.fire({
      icon: "success",
      title,
      text: message,
      showConfirmButton: false,
      timer: 1500,
      position: "top-end",
    });
  };

  const showError = (message = "Something went wrong. Please try again.", title = "Error") => {
    Swal.fire({
      icon: "error",
      title,
      text: message,
      showConfirmButton: false,
      timer: 3000,
      position: "top-end",
    });
  };

  const showWarning = (message = "Please check your input.", title = "Warning") => {
    Swal.fire({
      icon: "warning",
      title,
      text: message,
      showConfirmButton: false,
      timer: 2500,
      position: "top-end",
    });
  };

  const showInfo = (message = "Some information for you.", title = "Information") => {
    Swal.fire({
      icon: "info",
      title,
      text: message,
      showConfirmButton: false,
      timer: 2500,
      position: "top-end",
    });
  };

  return { 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo, 
    showButtonAlert, 
    showConfirm 
  };
};

export default UseAlert;
