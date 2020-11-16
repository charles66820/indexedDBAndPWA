(() => {
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.register("/js/sw.js");

  // Show install button and prepare install prompt
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    let btnInstall = document.querySelector("#btnInstall");
    btnInstall.style.display = "block";

    // Show the PWA install prompt
    btnInstall.addEventListener("click", () => {
      btnInstall.style.display = "none";
      e.prompt();
      e.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted")
          console.log("PWD install");
      });
    });
  });

  // Show messege after PWA install
  window.addEventListener("appinstalled", () => {
    alert("Thanks for install PWA");
  });
})();
