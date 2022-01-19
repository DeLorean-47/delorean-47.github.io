<script>
  let logo = "./assets/logo(white).png";
  let webstore = "./assets/webstore-button.png";
  // let feature1 = ;
  // let feature2 = ;
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</svelte:head>

<div class="header">
  <img id="logo" class="center" src={logo} alt="logo">
  <br>
  <!-- <button class="center">Chrome WebStore</button> -->
  <img class="center" id="chromeButton" src={webstore} alt="chrome-webstore-button">
</div>

<div class="mainContainer">
  <h1>Built for <span style="color: rgb(255, 50, 57)"> devs</span></h1>
  <p>Developed under tech accelerator, OS Labs, <span style="font-weight: 700; color: coral"> DeLorean</span> is Svelte's the first time traveling debugger tool that allows you to jump from state to state seamlessly.</p>
</div>

<div>
  <div>
    <h1>Features</h1>
    <span>
      feature 1:
    </span>
    <br>
    <!-- <img src=> -->
    <span>
      feature 2:
    </span>
    <!-- <img src=> -->
  </div>

  <div>
    <h1 class="whiteText">How to Get Started</h1>
    <span>
      Step 1: <br>
      Step 2: <br>
      Step 3: <br>
    </span>
  </div>
</div>

<div>
  <h1 class="whiteText">Meet the Team</h1>
  <div>

  </div>
</div>


<style>
  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .header {
    background-image: url(./assets/header-background2.png);
    background-repeat: no-repeat;
    background-size: cover;
    height: 50rem;
    animation: fadein 1s;
  }

  #logo {
    padding-top: 14rem;
    padding-bottom: 5rem;
    animation: fadein 1.5s ease-in;

  }

  #chromeButton {
    box-shadow: 0px 0px 20px rgb(206, 206, 206);
    border-radius: 10%/35%;
  }

  h1 {
    font-family: Raleway, Arial, Helvetica, sans;
    font-weight: 900;
    font-size: 2.5em;
  }

  p {
    font-family: Raleway, Arial, Helvetica, sans;
    font-size: 1.3em;
  }

  .whiteText {
    color: white;
    text-align: center;
  }

  span {
    font-family: Raleway, Arial, Helvetica, sans;
  }



  .mainContainer {
    padding: 3em;
    margin-left: 10em;
    margin-right: 10em;
    margin-top: 5em;
    border-radius: 20px;
    background-color: white;
    /* text-align: center; */
  }






  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideup {
    0% {
      transform: translateY(250px);
    }
    100% {
      transform: translateY(0);
    }
  }

</style>