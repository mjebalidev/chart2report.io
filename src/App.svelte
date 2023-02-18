<script>
  import chart2ReportLogo from './assets/Icon2.png'
  import Charter from './lib/Charter.svelte';
</script>

<main class="main">
  <div>
    <a href="https://www.meetyoo.com/en" target="_blank" rel="noreferrer"> 
      <img src={chart2ReportLogo} class="logo chart2report" alt="chart2report Logo" />
    </a>
  </div>

  <div class="card">
    <Charter />
  </div>

  <div class="footer">
    <p>
    Check out <a href="https://www.meetyoo.com/en" target="_blank" rel="noreferrer">meetyoo.com</a>, the official Meetyoo website.
    </p>

    <p class="read-the-docs">
    Click on the chart2report logo to learn more
    </p>
  </div>
</main>

<style>
  .logo {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10%;
    height: 6em;
    padding: 1 em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 1em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #FCFCFF);
  }
  .read-the-docs {
    color: #888;
  }

  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 600px;
    min-width: 600px;
    margin: 0 auto;
  }

  .footer{
    margin-top: 10%;
  }
</style>
