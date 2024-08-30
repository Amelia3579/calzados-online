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