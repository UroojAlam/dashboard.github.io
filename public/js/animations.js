document.addEventListener("DOMContentLoaded", function() {
   
    var homeAnim = lottie.loadAnimation({
      container: document.getElementById('home'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/Home.json'
    });
  
    var gridAnim = lottie.loadAnimation({
      container: document.getElementById('powerGrid'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/grid.json'
    });
  
    var batteriesAnim = lottie.loadAnimation({
      container: document.getElementById('batteries'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/battery.json'
    });
  
    var invertersAnim = lottie.loadAnimation({
      container: document.getElementById('inverters'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/animations/capacitor.json'
    });

    var motorAnim = lottie.loadAnimation({
      container: document.getElementById('motor'),
      renderer: 'mp4',
      loop: true,
      autoplay: true,
      path: 'assets/animations/motor-animation.mp4'
    });
  });
  