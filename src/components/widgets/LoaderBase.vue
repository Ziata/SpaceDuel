<template>
  <div class="spinner">
    <div class="spinner__solar-system solar-system">
      <div class="solar-system__orbit solar-system__orbit--earth orbit">
        <div class="orbit__planet orbit__planet--earth"></div>

        <div class="solar-system__orbit solar-system__orbit--venus orbit">
          <div class="orbit__planet orbit__planet--venus"></div>

          <div class="solar-system__orbit solar-system__orbit--mercury orbit">
            <div class="orbit__planet orbit__planet--mercury"></div>
            <div class="solar-system__sun"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  @keyframes spin {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(359deg);
    }
  }

  .spinner {
    width: 150px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin: 0 auto;
  }

  .solar-system {
    width: 125px;
    height: 125px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .orbit {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #fafbfc;
    border-radius: 50%;
  }

  .solar-system__orbit--earth {
    width: 83px;
    height: 83px;
    animation: spin 12s linear infinite;
  }

  .solar-system__orbit--venus {
    width: 60px;
    height: 60px;
    animation: spin 7.4s linear infinite;
  }

  .solar-system__orbit--mercury {
    width: 45px;
    height: 45px;
    animation: spin 3s linear infinite;
  }

  .orbit__planet {
    position: absolute;
    top: -3px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #3ff9dc;
  }

  .solar-system__sun {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #ffab91;
  }
</style>
