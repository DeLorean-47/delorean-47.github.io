<script>
  import { fly } from 'svelte/transition';
  // export let id;
  export let name;
  export let bio;
  export let ghHandle;
  export let liHandle;
  export let imgSrc;
  export let alt;

  const gh = `https://github.com/${ghHandle}`
  const li = `https://linkedin.com/in/${liHandle}`
</script>

<div transition:fly="{{ y: -30, duration: 700 }}" class="column">
  <div class="card">
    <img class="picture" src={imgSrc} {alt} style="width:100%" height="auto">
    <div class="container">
      <h2>{name}</h2>
      <p class="title">Software Engineer</p>
      <p class="bio">{bio}</p>
      <a href={gh}><img class="logo" src="../public/assets/github_logo.png" alt="{name} github link"></a>
      <a href={li}><img class="logo" src="../public/assets/linkedin_logo.png" alt="{name} linkedin link"></a>
    </div>
  </div>
</div>


<style>
.picture {
  width: 300px; 
  height: 400px;
  object-fit: cover;
  object-position: 50% 20%;
  border-radius: 0 20px;
}

.column {
  display: flex;
  flex-direction: center;
  justify-content: center;
  width: 33.3%;
  margin-bottom: 3%;
  padding: 20 8 5 5px;
  margin-left: 0;
}

.card {
  background-color: brown;
  height: 650px;
  width: 350px;
  border-radius: 0 20px;
  padding-bottom: 65px;
  transition: transform 0.5s;
}

.card:hover {
  transform: translateY(-5px) scale(1.005) translateZ(0);
}

.logo {
  margin: 0px 20px;
}

.bio {
  padding-left: 10px;
  padding-right: 10px;
}
</style>