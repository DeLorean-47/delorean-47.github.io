<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import TeamMember from './TeamMember.svelte';

  let visible = false;

  let y;

  let logo = "../public/assets/logo(white).png";
  let webstore = "../public/assets/webstore-button.png";
  let github = "../public/assets/github_logo.png";
  let linkedin = "../public/assets/linkedin_logo.png";
  let captureState = "../public/assets/capture_state.gif";
  let connect = "../public/assets/connect.gif";
  let newMemory = "../public/assets/new_memory.gif";
  let timeTravel = "../public/assets/time_travel.gif";
  // let feature1 = ;
  // let feature2 = ;
  onMount(() => {
    visible = true;
  });

  // let bg = document.getElementById("header");
  // let test = bg.style.backgroundSize;
  // test = y+"%";
  // window.addEventListener('scroll', function() {
  //   bg.style.backgroundSize = 
  // })
   const teamMembers = [
     {
      name: "Albert Han",
      bio: "A Los Angeles based software engineer with a passion for baseball, eating, and low-stakes poker",
      ghHandle: "alberthan1",
      liHandle: "albert-han1",
      imgSrc: "../public/assets/albert.jpg",
      alt: "albert"
     },
     {
      name: "Aram Krakirian",
      bio: "Born and raised LA boy with big love for coffee, beach volleyball, and live music",
      ghHandle: "aramkrakirian",
      liHandle: "aram-krakirian",
      imgSrc: "../public/assets/aram.PNG",
      alt: "aram"
     },
     {
      name: "Erick Maese",
      bio: "A Los Angeles based software engineer with a passion for painting, gaming, and everything MCU",
      ghHandle: "erickmaese",
      liHandle: "erickmaese",
      imgSrc: "../public/assets/erick.jpeg",
      alt: "erick"
     },
     {
      name: "Sam VanTassel",
      bio: "An LA guy from Minnesota by way of New Orleans. Big on board games, synthesizers and Mardi Gras parading.",
      ghHandle: "SamVanTassel",
      liHandle: "samvantassel",
      imgSrc: "../public/assets/sam.jpg",
      alt: "sam"
     },
     {
      name: "Trevor Leung",
      bio: "A Los Angeles based software engineer",
      ghHandle: "trevleung",
      liHandle: "trevleung",
      imgSrc: "../public/assets/trevor.jpg",
      alt: "trevor"
     },
   ]
</script>








<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</svelte:head>

<svelte:window bind:scrollY={y} />




<div id="header">
  {#if visible}
    <img transition:fly="{{ y: -100, duration: 2000 }}" id="logo" class="center" src={logo} alt="logo" >
  {/if}
  <br>
  <img class="center" id="chromeButton" src={webstore} alt="chrome-webstore-button">
</div>



{#if y >= 300}
  <div transition:fly="{{ y: 30, duration: 700 }}" class="mainContainer">
    <h1 transition:fly="{{ y: -30, duration: 1500 }}">Built for <span style="color: rgb(255, 50, 57)"> devs</span></h1>
    <p transition:fly="{{ y: -30, duration: 1500 }}">Developed under tech accelerator, OS Labs, <span style="font-weight: 700; color: coral"> DeLorean</span> is Svelte's the first time traveling debugger tool that allows you to jump from state to state seamlessly.DeLorean features a clean, minimal UI that's easily accessible from within a Chrome Developer Tools panel. It displays the name of each component and the names of all variables that each component contains. Each variable displays its value at whatever point in time you are examining.</p>
  </div>
{/if}



<div>
  
    <div id="features">
      {#if y >= 800}
      <h1 transition:fly="{{ y: -30, duration: 700 }}" class="whiteText">Features</h1>
      {/if}
      {#if y >= 800}
      <span class="featureText">
        <p transition:fly="{{ x: 30, duration: 700 }}" class="feat">As DeLorean renders an app in its previous state, a user may want to interact with the application in a different way than before. Apps remain fully functional while being tested with DeLorean, so any changes the user makes will simply create a new timeline that is now tracked in the Dev Tools panel.</p>
        <img transition:fly="{{ x: -30, duration: 700 }}" class="gif" src={newMemory} alt="showing-UI" height="100%" width="auto">
      </span>
      {/if}
      <br>
      <br>
      {#if y >= 1200}
      <span class="featureText">
        <img transition:fly="{{ x: 30, duration: 700 }}" class="gif" src={captureState} alt="capturing-state" height="100%" width="auto">
        <p transition:fly="{{ x: -30, duration: 700 }}" class="feat">As you make changes to your app, each component’s state at the time of the state change is stored in a snapshot and cached. These snapshots are able to viewed in the dev tool panel.</p>
      </span>
      {/if}
      <br>
      <br>
      {#if y >= 1600}
      <span class="featureText">
        <p transition:fly="{{ x: 30, duration: 700 }}" class="feat">In addition to displaying component and variable information, DeLorean resets your application's state to the values it contained at any point since DeLorean was connected to your application. This allows for step-by-step examination of state change sequences within an application, easing the challenge of tracking state changes over time and reducing the need for console.logs.</p>
        <img transition:fly="{{ x: -30, duration: 700 }}" class="gif"src={timeTravel} alt="time-traveling" height="100%" width="auto">
      </span>
      {/if}
      <br>
    </div>

  {#if y >= 2000}
  <div transition:fly="{{ y: -30, duration: 700 }}" id="getStartedBackground">
    <div id="getStarted">
      <h1>How to Get Started</h1>
      <span>
        <strong>Step 1:</strong> To install DeLorean simply navigate to the DeLorean GitHub page. If you're interested in learning more about how DeLorean works, feel free to clone the repo! Otherwise, just download the chrome_extension folder and save it somewhere on your computer.
        <br>
        <br>
        <strong>Step 2:</strong> Then navigate to Chrome's extensions page. Ensure you are in developer mode by clicking the 'Developer Mode' switch in the top-right corner of the page. Click on 'Load Unpacked', and select the chrome_extension folder downloaded earlier. Open up your Dev Tools, and check to make sure DeLorean is available in the dropdown menu of the navbar as a panel!
        <br>
        <br>
        <strong>Step 3:</strong> Once your app is up and running, open the Dev Tools and select DeLorean from the dropdown in the navbar. Then click connect, and you should see your application's initial state loaded in the panel.
        <br>
        <br>
        <strong>Step 4:</strong> Make some state changes, then click the state buttons!
      </span>
    </div>
  </div>
  {/if}
</div>
 
{#if y >= 2400}
  <div class="whiteText teamMembers">
    <h1 class="whiteText">Meet the Team</h1>
    <div class="row">
      {#each teamMembers as member, i}
        <TeamMember id={i} {...member} />
      {/each}
    </div>
  </div>
{/if}

{#if y > 3000}
<span id="padding"></span>
{:else}
<footer></footer>
{/if}


<style>
  :global(p) {
    font-family: Raleway, Arial, Helvetica, sans;
    font-size: 1.3em;
  }
  
  :global(h1) {
    font-family: Raleway, Arial, Helvetica, sans;
    font-weight: 900;
    font-size: 2.5em;
  }

  :global(h2) {
    font-family: Raleway, Arial, Helvetica, sans;
    font-weight: 800;
    font-size: 1.8em;
  }

  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  #header {
    background-image: url(./assets/header-background2.png);
    background-repeat: no-repeat;
    background-size: cover;
    height: 50rem;
    /* padding-top: 14rem; */
    /* animation: fadein 1s; */
  }

  #logo {
    padding-top: 14rem;
    padding-bottom: 4.5rem;
    /* animation: fadein 1.5s ease-in; */

  }

  #chromeButton {
    box-shadow: 0px 0px 20px rgb(206, 206, 206);
    border-radius: 10%/35%;
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

  #features {
    padding: 3em;
    margin-left: 10em;
    margin-right: 10em;
  }

  #getStartedBackground {
    border-radius: 30px 0 30px 0;
    background-color: white;
  }

  #getStarted {
    padding: 3em;
    margin-left: 10em;
    margin-right: 10em;
  }

  /* @keyframes fadein {
    from { opacity: 0; transform: translateY(-250px)}
    to   { opacity: 1; transform: translateY(0)}
  } */
  

  .gif {
    margin: 0px 20px;
    display: flex;
    border-radius: 10px;
    width: 55%;
    height: auto;
  }

  .featureText {
    display: flex;
    width: 100%;
    align-items: center;
    color: white;
  }

  .feat {
    color: white;
    margin: 0px 20px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* margin: 5em 10em; */
  }

  .teamMembers {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0em 0.5em;
    /* text-align: center;
    margin: auto;
    align-content: center; */
  }

  footer {
    padding-bottom: 100em;
  }

  #padding {
    margin-bottom: 200px;
  }

</style>