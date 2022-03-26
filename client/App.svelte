<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import TeamMember from './TeamMember.svelte';

  let visible = false;
  let y; 
  
  const logos = {
    delorean: "../public/assets/logo(white).png",
    webstore: "../public/assets/webstore-button.png",
    github: "../public/assets/github_logo.png",
    linkedin: "../public/assets/linkedin_logo.png",
    oslabs: "../public/assets/OSLabs.png"
  }
  const gifs = {
    captureState: "./assets/capture_state.gif",
    connect: "../public/assets/connect.gif",
    newMemory: "../public/assets/new_memory.gif",
    timeTravel: "../public/assets/time_travel.gif"
  }
  const links = {
    li: "https://www.linkedin.com/company/delorean-open-source/",
    gh: "https://github.com/oslabs-beta/DeLorean",
    med: "https://medium.com/@vantassel.sam/time-travel-debugging-in-svelte-with-delorean-26e04efe9474"
  };
  const teamMembers = [
    {
      name: "Albert Han",
      bio: "A software engineer torn between calling LA or the Bay home with a passion for baseball, eating, and low-stakes poker.",
      ghHandle: "alberthan1",
      liHandle: "albert-han1",
      imgSrc: "../public/assets/albert.jpg",
      alt: "albert han",
      imgColor: "rgb(131, 123, 118)"
    },
    {
      name: "Aram Krakirian",
      bio: "Born and raised LA boy with big love for coffee, beach volleyball, and live music.",
      ghHandle: "aramkrakirian",
      liHandle: "aram-krakirian",
      imgSrc: "../public/assets/aram.jpg",
      alt: "aram krakirian",
      imgColor: "rgb(180, 174, 163)"
    },
    {
      name: "Erick Maese",
      bio: "A Los Angeles based software engineer with a passion for painting, gaming, and everything MCU.",
      ghHandle: "erickmaese",
      liHandle: "erickmaese",
      imgSrc: "../public/assets/erick.jpg",
      alt: "erick maese",
      imgColor: "rgb(175, 177, 171)"
    },
    {
      name: "Sam VanTassel",
      bio: "LA guy from Minnesota by way of New Orleans. Big on board games, synthesizers, and Mardi Gras parading.",
      ghHandle: "SamVanTassel",
      liHandle: "samvantassel",
      imgSrc: "../public/assets/sam.jpg",
      alt: "sam vantassel",
      imgColor: "rgb(246, 192, 130)"
    },
    {
      name: "Trevor Leung",
      bio: "Just an Aussie living in Los Angeles. Infatuated with Ted Talk riddles, scuba diving, and lollies.",
      ghHandle: "trevleung",
      liHandle: "trevleung",
      imgSrc: "../public/assets/trevor.jpg",
      alt: "trevor leung",
      imgColor: "rgb(237, 237, 237)"
    },
  ];

  onMount(() => {
    setTimeout(() => { visible = true; }, 500)
  });
</script>


<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</svelte:head>

<svelte:window bind:scrollY={y} />



<div id="header">
  {#if visible}
  <div class="oslabs">
    <a href="https://opensourcelabs.io/"><img src={logos.oslabs} alt="OSLabs" style="max-width: 7.5em; max-height: auto;"></a>
  </div>
  <!-- {#if visible} -->
    <img transition:fly="{{ y: -50, duration: 1600 }}" id="logo" class="center" src={logos.delorean} alt="logo" >
  <!-- {/if} -->
  <br>
  <a href={links.gh} target="_blank"><img class="center" id="githubButton" src={logos.webstore} alt="github-webstore-button"></a>
  {/if}
</div>


{#if y >= 300}
  <div transition:fly="{{ y: 30, duration: 700 }}" class="mainContainer">
    <h1 transition:fly="{{ y: -30, duration: 1500 }}">Built for <span style="color: coral"> devs</span></h1>
    <p transition:fly="{{ y: -30, duration: 1500 }}">Developed under tech accelerator, OS Labs, <span style="font-weight: 700; color: rgb(255, 50, 57)"> DeLorean</span> is Svelte's first time-traveling debugger tool that allows you to seamlessly jump from state to state. DeLorean features a clean, minimal UI that is easily accessible within the Chrome Developer Tools panel. It displays the names of all variables within each stateful component rendered on the app. Each variable displays its value at the given point in time you are examining.</p>
  </div>
{/if}


<div>

  <div id="features">
      {#if y >= 700}
      <h1 id="featuresTitle" transition:fly="{{ y: -30, duration: 700 }}" class="whiteText">Features</h1>
      {/if}
      {#if y >= 900}
      <span class="featureText">
        <p transition:fly="{{ x: 30, duration: 700 }}" class="feat featLeft">
          <strong>Capture State</strong><br><span>As you make changes to your app, each component’s state at the time of the state change is stored in a snapshot and cached.</span></p>
        <div transition:fly="{{ x: -30, duration: 700 }}" class="gifPlaceholder"><img class="gif"src={gifs.captureState} alt="capturing-state"></div>
      </span>
      {/if}
      <br>
      <br>
      {#if y >= 1400}
      <span class="featureText">
        <div class="gifRight"><div transition:fly="{{ x: -30, duration: 700 }}" class="gifPlaceholder"><img class="gif" src={gifs.timeTravel} alt="time-traveling"></div></div>
        <p transition:fly="{{ x: 30, duration: 700 }}" class="feat featRight"><strong>Time Travel</strong><br><span>Upon clicking a State button on <span style="font-weight: 700; color: rgb(255, 90, 57)">DeLorean</span>, you can see your application's state at that given snapshot, both in the DevTool as well as in the app, allowing for step-by-step examination of state change sequences.</span></p>
      </span>
      {/if}
      <br>
      <br>
      {#if y >= 1800}
      <span class="featureText">
        <p transition:fly="{{ x: 30, duration: 700 }}" class="feat featLeft"><strong>New Branches</strong><br><span>When you change state while examining a previous state, <span style="font-weight: 700; color: rgb(255, 90, 57)"> DeLorean</span> will simply create and track a new timeline in the app and Dev Tools panel.</span></p>
        <div transition:fly="{{ x: -30, duration: 700 }}" class="gifPlaceholder"><img class="gif" src={gifs.newMemory} alt="showing-UI"></div>
      </span>
      {/if}
    </div>
      <br>

    {#if y >= 2200}
    <div transition:fly="{{ y: -30, duration: 700 }}" id="getStartedBackground">
      <div id="getStarted">
      <h1 transition:fly="{{ y: -30, duration: 1500 }}">How to Get Started</h1>
        <div transition:fly="{{ y: 30, duration: 1500  }}" id="steps">
          <strong>Step 1:</strong> To install DeLorean, head to the 
          <a style="font-family: Raleway, Arial, Helvetica, sans;
          font-size: 18px;" href={links.gh} target="_blank">DeLorean GitHub page</a>. If you're interested in learning more about how DeLorean works, feel free to clone the repo! Otherwise, just download the <i>chrome_extension</i> folder and save it somewhere on your computer.
          <br>
          <br>
          <strong>Step 2:</strong> Navigate to Chrome's extensions page. Ensure you are in developer mode by clicking the 'Developer Mode' switch in the top-right corner of the page. Click on 'Load Unpacked', and select the <i>chrome_extension</i> folder downloaded earlier to add DeLorean to your extensions.
          <br>
          <br>
          <strong>Step 3:</strong> Once your test app is up and running, open the Dev Tools panel and select DeLorean from the dropdown in the navbar. Then click Connect, and you should see your application's initial state loaded in the panel. Make some state changes and travel through time!
        </div>
    </div>
  </div>
    {/if}
</div>

{#if y >= 2800}
  <div id="teamMembers" class="whiteText teamMembers">
    <h1 transition:fly="{{ y: -30, duration: 700 }}" id="teamText" class="whiteText">Meet the Team</h1>
    <div transition:fly="{{ y: -30, duration: 700 }}" class="row">
      {#each teamMembers as member, i}
        <TeamMember id={i} {...member} />
      {/each}
    </div>
  </div>
{/if}

{#if y > 3200}
<span id="padding"></span>
{:else}
<footer></footer>
{/if}

<div id="bottomLinks"><p id="footerText">Find out more at: <a href={links.gh} target="_blank">Github</a> | 
  <a href={links.li} target="_blank">LinkedIn </a> | <a href={links.med} target="_blank">Medium </a>
</p>

</div>

<style>
  :global(p) {
    font-family: Raleway, Arial, Helvetica, sans;
    font-size: 18px;
  }
  
  :global(h1) {
    font-family: Raleway, Arial, Helvetica, sans;
    font-weight: 900;
    font-size: 40px;
  }

  :global(h2) {
    font-family: Raleway, Arial, Helvetica, sans;
    font-weight: 800;
    font-size: 30px;
  }

  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  #header {
    background-image: url(../assets/header-background2.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    height: 50rem;
    animation: fade 1s;
  }

  #logo {
    padding-top: 10rem;
    padding-bottom: 4.5rem;
    max-width: 250px;
    max-height: auto;
  }

  #githubButton {
    box-shadow: 0px 0px 20px rgb(206, 206, 206);
    border-radius: 10%/35%;
    transition: transform 0.4s;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    max-width: 180px;
    max-height: auto;
  }
  
    #githubButton:hover {
      transform: scale(1.02) translateZ(0);
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
  }



  #features {
    padding: 5em 7em 5em;
    margin-left: 3em;
    margin-right: 3em;
  }

  #getStartedBackground {
    border-radius: 30px 0 30px 0;
    background-color: white;
    padding-bottom: 2.2em;
  }

  #getStarted {
    padding: 3em;
    margin-left: 10em;
    margin-right: 10em;
  }
  
  .gifPlaceholder {
    height: 370px;
    width: 624px;
    border-radius: 10px;
    margin: 30px 20px;
    background-color: rgb(15, 17, 40);
    margin-bottom: 2em;
  }

  .gif {
    display: flex;
    height: 100%;
    width: auto;
    border-radius: 10px;
  }

  .featureText {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
    color: white;
  }

  .feat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
    margin: 0px 20px;
  }

  .featLeft {
    align-items: flex-end;
    text-align: right;
    padding-left: 10%;
  }

  .gifRight {
    display: flex;
    justify-content: end;
    width: 100%
  }

  .featRight {
    align-items: flex-start;
    padding-right: 10%;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .teamMembers {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0em 0.5em;
  }

  footer {
    padding-bottom: 100em;
  }

  #padding {
    margin-bottom: 200px;
  }

  #featuresTitle {
    padding-bottom: 0.5em;
  }

  #bottomLinks {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    background-color: white;
  }

  #footerText {
    color: black;
  }

  a {
    text-decoration: none;
    color: rgb(200, 51, 57);
  }
  
  a:hover {
    text-decoration: underline;
  }

  strong{
    font-size: 30px;
    font-weight: 800;
    color: coral;
  }

  #teamText{
    margin: 80px 0px;
  }

  #steps {
    font-family: Raleway, Arial, Helvetica, sans;
    padding-top: 1em;
    padding-left: 2.5em;
    padding-right: 2.5em;
  }
  
  .oslabs {
    padding: 1em;
    text-align: center;
  }

  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }


  /* media query for tablets */
  @media only screen and (max-width: 768px) {
    .mainContainer {
      padding: 3em;
      margin-left: 5em;
      margin-right: 5em;
      margin-top: 5em;
      border-radius: 10px;
    }


    #features {
      padding: 50px;
      margin:auto;
    }

    .gifPlaceholder {
    height: 222px;
    width: 374.4px;
    border-radius: 10px;
    margin: 30px 20px;
    background-color: rgb(15, 17, 40);
    margin-bottom: 2em;
    }

    .gif {
    display: flex;
    height: 100%;
    width: auto;
    border-radius: 10px;
    }

    #getStarted {
    padding: 3em;
    margin-left: auto;
    margin-right: auto;
    }
  }

  /* media query for mobile */
  @media only screen and (max-width: 456px) {
    .mainContainer {
      padding: 3em;
      margin-left: auto;
      margin-right: auto;
      margin-top: 5em;
      border-radius: 10px;
    }

    #features {
      display:grid;
      justify-items: center;
      padding: 0;
    }

    .featureText {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    }

    .feat {
    display: block;
    flex-direction: column;
    justify-content: center;
    color: white;
    margin: 10px 10px;
    }

    .featLeft {
    align-items: flex-start;
    text-align: center;
    padding-left: 0%;
    }

    .featRight {
    align-items: flex-start;
    padding-right: 0%;
    text-align: center;
  }

    .gifPlaceholder {
    height: 166.5px;
    width: 280.8px;
    border-radius: 10px;
    margin: 30px 20px;
    background-color: rgb(15, 17, 40);
    margin-bottom: 2em;
    }

    .gif {
    display: flex;
    height: 100%;
    width: auto;
    justify-content: center;
    border-radius: 10px;
    }

    .gifRight {
    display: flex;
    justify-content: center;
    width: 100%
  }

    #getStarted {
    padding: 3em;
    margin-left: auto;
    margin-right: auto;
    }


    
  }
  @media only screen and (max-width: 375px) {
    #features {
    margin-left: 25px;
    margin-right: 25px;
    }
  }
  @media only screen and (max-width: 320px) {
    #features {
      margin: auto; 
    }
  }
</style>