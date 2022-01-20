<script>
  export let name;
  export let bio;
  export let ghHandle;
  export let liHandle;
  export let imgSrc;
  export let alt;
  export let imgColor;

  const gh = `https://github.com/${ghHandle}`
  const li = `https://linkedin.com/in/${liHandle}`
</script>

<div class="column">
  <div class="card">
    <div class="imgWrapper" style="background-color:{imgColor}">
      <img class="picture" src={imgSrc} {alt} style="width:100%" height="auto">
    </div>
    <div class="container">
      <h2>{name}</h2>
      <p class="title">Software Engineer</p>
      <p class="bio">{bio}</p>
      <div class="memberLogos"> 
        <a href={gh} target="_blank"><img class="logo" src="../public/assets/github_logo.png" alt="{name} github link"></a>
        <a href={li} target="_blank"><img class="logo" src="../public/assets/linkedin_logo.png" alt="{name} linkedin link"></a>
      </div>
    </div>
  </div>
</div>


<style>
.picture {
  width: 300px; 
  height: 400px;
  object-fit: cover;
  /* object-position: 50% 20%; */
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
  position: relative;
  background-color: rgb(200, 51, 57);
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
  padding: 0px 15px;
}

.memberLogos {
  position: absolute;
  bottom: 15px;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
}
.imgWrapper {
  height: 400px;
  object-fit: cover;
  object-position: 50% 20%;
  border-radius: 0 20px;
}
</style>