if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(() =>
    document.querySelector("#pwastatus").innerText = "PWA successfully load"
  ).catch(e => {
    console.error("PWA registration failed with " + e);
    document.querySelector("#pwastatus").innerText = "PWA error on load";
  });
else document.querySelector("#pwastatus").innerText = "PWA unsupported (your browser is to old)";

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
  document.querySelector("#pwastatus").innerText = "PWA install with success";
  alert("Thanks for install PWA");
});
