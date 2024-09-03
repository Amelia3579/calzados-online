function removeUser(userId) {
  fetch(`/api/users/inactiveUsers/${userId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error removing the user from file.");
      }
      location.reload();
    })
    .catch((error) => {
      console.error(`Error removing the user from file: ${error.message}`);
    });
}

let currentUserId = null;

function changeUserRole(userId) {
  currentUserId = userId;

  fetch(`/api/users/premium/${userId}`, {
    method: "PUT",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error changing the role.");
      }
      return response.json();
    })
    .then((result) => {
      const newRole = result.user.role;
      // Actualizo el texto en la interfaz
      document.getElementById(`role-${userId}`).textContent = newRole;

      Swal.fire({
        title: "Success!",
        text: "Role changed successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    })

    .catch((error) => {
      console.error(`Error changing the role: ${error.message}`);

      Swal.fire({
        title: "Error!",
        text: `${error.message}. Please ensure that all required documents are uploaded before attempting to change roles.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    });

  document
    .getElementById("uploadForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      if (!currentUserId) {
        alert("No user selected for document upload.");
        return;
      }

      const form = event.target;
      form.action = `/api/users/${currentUserId}/documents`;
      const formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Document uploaded successfully.") {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Document uploaded successfully!",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((error) => {
          console.error(`Error sending the documents: ${error.message}`);
        });
    });
}
