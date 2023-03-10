<script>
  import {
    Button,
    Dropdown,
    DropdownItem,
    Chevron,
    Checkbox,
    Label,
    P,
    Tabs,
    TabItem,
    Input,
    Alert,
    Progressbar,
  } from "flowbite-svelte";
  import chart1 from "../assets/chart1.png";
  import chart2 from "../assets/chart2.png";
  import chart3 from "../assets/chart3.png";
  import chart4 from "../assets/chart4.png";
  import chart5 from "../assets/chart5.png";
  import chart6 from "../assets/chart6.png";
  import chart7 from "../assets/chart7.png";
  import chart8 from "../assets/chart8.png";
  import chart9 from "../assets/chart9.png";
  import chart10 from "../assets/chart10.png";
  import chart11 from "../assets/chart11.png";
  import chart12 from "../assets/chart12.png";
  import chart13 from "../assets/chart13.png";
  import chart14 from "../assets/chart14.png";
  import chart15 from "../assets/chart15.png";
  import chart16 from "../assets/chart16.png";
  
  import SortableList from 'svelte-sortable-list';
  import Component from './Component.svelte';

  let sleepTime = 2000;
  let dropDownCounter = 0;
  let display = false;
  let checkCopy = false;
  let dataSaved = false;

  let alertKPIs = false;
  let alertBoothVisitsOverTime = false;
  let alertBoothVisits = false;
  let alertVideoViews = false;
  let alertDownloads = false;
  let alertBoothChats = false;
  let alertVideochatsPerBooth = false;
  let alertAll = false;
  let alertNone = false;

  let alertDeactivationAll = false;
  let alertDeactivationKPIs = false;
  let alertDeactivationBoothVisitsOverTime = false;
  let alertDeactivationBoothVisits = false;
  let alertDeactivationVideoViews = false;
  let alertDeactivationDownloads = false;
  let alertDeactivationBoothChats = false;
  let alertDeactivationVideochatsPerBooth = false;

  let dropDownCounterRegister = 0;
  let dropDownCounterEvent1 = 0;
  let dropDownCounterEvent2 = 0;
  let dropDownCounterEvent3 = 0;
  let dropDownCounterRegisterLogin = 0;


  let language = "EN";
  let eventId = 0;
  let boothId = 0;
  let prefix = "";
  let eventName = "";
  let profile1 = "";
  let profile1title = "";
  let profile2 = "";
  let profile2title = "";
  let finalXML = "";

  let kpiXML = "";
  let boothVisitsOverTimeXML = "";
  let boothVisitsXML = "";
  let videoViewsXML = "";
  let downloadsXML = "";
  let boothChatsXML = "";
  let videoChatsPerBoothXML = "";

  let valueProgressbar = "0";

  let list = [];

  const sortList = ev => {list = ev.detail};

  function addObject(object) {
    let exists = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === object.id) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      list.push(object);
      console.log(`${object.name} has been added to the list.`);
    } else {
      console.log(`${object.name} is already in the list.`);
    }
  }

  function removeObject(id) {
    let index = -1;
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      let removedObject = list.splice(index, 1)[0];
      console.log(`${removedObject.name} has been removed from the list.`);
    } else {
      console.log(`Object with id ${id} not found in the list.`);
    }
  }

  function renderXML() {
    let headerXML = `<report eventid='${eventId}' title='${eventName}' >`;
    let footerXML = `</report>`;

    for (let i = 0; i < list.length; i++) {
      let content = list[i].content;
      if (typeof content === "string") {
        finalXML += content;
      }
    }
    finalXML = headerXML + finalXML + footerXML;
    display = true;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(finalXML);
    checkCopy = true;
  }

  function saveData() {
    dataSaved = true;
  }

  function resetData() {
    finalXML = "";
    display = false;
    list = [];
  }

  function AddKPIs() {
    ActivationActionAlert("kpi");
    kpiXML = `<chart  title='KPIs'  query='select count(userid), email, sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent"   group by email| select count($1), sum($2), sum($2)/count($1)/60 Label count($1) "Unique visitors", sum($2)/count($1)/60 "Avg Duration in(m)", sum($2) "Total visits duration"' type='Gauge' table='boothvisits' ></chart>`;
    addObject({id: 1, name: "KPIs", content: kpiXML, image: chart1});
  }

  function RemoveKPIs() {
    DeactivationActionAlert("kpi");
    removeObject(1);
  }

  function AddBoothVisitsOverTime() {
    ActivationActionAlert("boothVisitsOverTime");
    boothVisitsOverTimeXML = `<chart  title='Booth visits over time'  query='select toDate(time), count(userid) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent"    group by toDate(time) order by toDate(time) | accumulate $1' type='AnnotationChart' table='boothvisits' ></chart>`;
    addObject({id:2, name: "Booth Visits Over Time", content:boothVisitsOverTimeXML, image: chart2});
  }

  function RemoveBoothVisitsOverTime() {
    DeactivationActionAlert("boothVisitsOverTime");
    removeObject(2);
  }

  function AddBoothVisits() {
    ActivationActionAlert("boothVisits");
    boothVisitsXML = `<chart  title='Booth Visits'  query='select firstname, lastname, email,   sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by email, firstname, lastname  LABEL sum(duration) "Duration (in sec)"  | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='boothvisits' ></chart>`;
    addObject({id:3, name: "Booth Visits", content:boothVisitsXML, image: chart3});
  }

  function RemoveBoothVisits() {
    boothVisitsXML = "";
    DeactivationActionAlert("boothVisits");
    removeObject(3);
  }

  function AddVideoViews() {
    ActivationActionAlert("videoViews");
    videoViewsXML = `<chart  title='Video Views'  query='select firstname, lastname, email,    videoname, sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by firstname, lastname, email, videoname  LABEL sum(duration) "Duration (in sec)"    | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='video' ></chart>`;
    addObject({id:4, name: "Video Views", content:videoViewsXML, image: chart4});
  }

  function RemoveVideoViews() {
    videoViewsXML = "";
    DeactivationActionAlert("videoViews");
    removeObject(4);
  }

  function AddDownloads() {
    ActivationActionAlert("downloads");
    downloadsXML = `<chart  title='Downloads'  query='select firstname, lastname, email,    filename, sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by firstname, lastname, email, filename  LABEL sum(duration) "Duration (in sec)"    | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='downloads' ></chart>`;
    addObject({id:5, name: "Downloads", content:downloadsXML, image: chart5});
  }

  function RemoveDownloads() {
    DeactivationActionAlert("downloads");
    removeObject(5);
  }

  function AddBoothChats() {
    ActivationActionAlert("boothChats");
    boothChatsXML = `<chart  title='Booth Chats'  query='select firstname, lastname, email,    sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by firstname, lastname, email  LABEL sum(duration) "Duration (in sec)"    | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='boothchats' ></chart>`;
    addObject({id:6, name: "Booth Chats", content:boothChatsXML, image: chart6});
  }

  function RemoveBoothChats() {
    DeactivationActionAlert("boothChats");
    removeObject(6);
  }

  function AddVideochatsPerBooth() {
    ActivationActionAlert("videochatsPerBooth");
    videoChatsPerBoothXML = `<chart  title='Videochats per booth'  query='select firstname, lastname, email,    sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by firstname, lastname, email  LABEL sum(duration) "Duration (in sec)"    | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='videochats' ></chart>`;
    addObject({id:7, name: "Videochats per booth", content:videoChatsPerBoothXML, image: chart7});
  }

  function RemoveVideochatsPerBooth() {
    videoChatsPerBoothXML = "";
    DeactivationActionAlert("videochatsPerBooth");
    removeObject(7);
  }

  function AddAll() {
    ActivationActionAlert("all");
    kpiXML = `<chart  title='KPIs'  query='select firstname, lastname, email,   sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by email, firstname, lastname  LABEL sum(duration) "Duration (in sec)"  | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='boothvisits' ></chart>`;
    boothVisitsOverTimeXML = `<chart  title='Booth Visits Over Time'  query='select firstname, lastname, email,   sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by email, firstname, lastname  LABEL sum(duration) "Duration (in sec)"  | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='boothvisits' ></chart>`;
    boothVisitsXML = `<chart  title='Booth Visits'  query='select firstname, lastname, email,   sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by email, firstname, lastname  LABEL sum(duration) "Duration (in sec)"  | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='boothvisits' ></chart>`;
    videoViewsXML = `<chart  title='Video Views'  query='select firstname, lastname, email,    videoname, sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by firstname, lastname, email, videoname  LABEL sum(duration) "Duration (in sec)"    | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='video' ></chart>`;
    downloadsXML = `<chart  title='Downloads'  query='select firstname, lastname, email,    filename, sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by firstname, lastname, email, filename  LABEL sum(duration) "Duration (in sec)"    | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='downloads' ></chart>`;
    boothChatsXML = `<chart  title='Booth Chats'  query='select firstname, lastname, email,    sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by firstname, lastname, email  LABEL sum(duration) "Duration (in sec)"    | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='boothchats' ></chart>`;
    videoChatsPerBoothXML = `<chart  title='Videochats per booth'  query='select firstname, lastname, email,    sum(duration) where docid contains "doc:${boothId}"   and not email contains "meetyoo" and not email contains "ubivent" and  =  group by firstname, lastname, email  LABEL sum(duration) "Duration (in sec)"    | replace $2 ${prefix} type='ubiventCharts.TableWithLinks' table='videochats' ></chart>`;
    addObject({id:1, name: "KPIs", content:kpiXML});
    addObject({id:2, name: "Booth Visits Over Time", content:boothVisitsOverTimeXML});
    addObject({id:3, name: "Booth Visits", content:boothVisitsXML});
    addObject({id:4, name: "Video Views", content:videoViewsXML});
    addObject({id:5, name: "Downloads", content:downloadsXML});
    addObject({id:6, name: "Booth Chats", content:boothChatsXML});
    addObject({id:7, name: "Videochats per booth", content:videoChatsPerBoothXML});
  }

  function RemoveAll() {
    DeactivationActionAlert("all");
    removeObject(1);
    removeObject(2);
    removeObject(3);
    removeObject(4);
    removeObject(5);
    removeObject(6);
    removeObject(7);
  }

  function AddRegistrationTotal(){

  }

  function RemoveRegistrationTotal(){

  }

  function AddRegistrationPerDay(){

  }

  function RemoveRegistrationPerDay(){

  }

  function AddRegistrationDetails(){

  }

  function RemoveRegistrationDetails(){

  }

  function AddAllRegistrationCharts(){

  }

  function RemoveAllRegistrationCharts(){

  }

  function AddRegistrationTotalConfirmed(){

  }

  function RemoveRegistrationTotalConfirmed(){

  }

  function AddVisitorsTotal(){

  }

  function RemoveVisitorsTotal(){

  }

  function AddLoginPerDay(){

  }

  function RemoveLoginPerDay(){

  }

  function AddLoginPerDayUnique(){

  }

  function RemoveLoginPerDayUnique(){

  }

  function AddVisitorsGlobal(){

  }

  function RemoveVisitorsGlobal(){

  }

  function AddVisitorsRegional(){

  }

  function RemoveVisitorsRegional(){

  }

  function AddAllRegistrationLoginCharts(){

  }

  function RemoveAllRegistrationLoginCharts(){

  }

  function ActivationActionAlert(action) {
    if (action == "kpi") {
      alertKPIs = true;
    } else if (action == "boothVisitsOverTime") {
      alertBoothVisitsOverTime = true;
    } else if (action == "boothVisits") {
      alertBoothVisits = true;
    } else if (action == "videoViews") {
      alertVideoViews = true;
    } else if (action == "downloads") {
      alertDownloads = true;
    } else if (action == "boothChats") {
      alertBoothChats = true;
    } else if (action == "videochatsPerBooth") {
      alertVideochatsPerBooth = true;
    } else if (action == "all") {
      alertAll = true;
    } else if (action == "none") {
      alertNone = true;
    }
  }

  function DeactivationActionAlert(action) {
    if (action == "kpi") {
      alertDeactivationKPIs = true;
    } else if (action == "boothVisitsOverTime") {
      alertDeactivationBoothVisitsOverTime = true;
    } else if (action == "boothVisits") {
      alertDeactivationBoothVisits = true;
    } else if (action == "videoViews") {
      alertDeactivationVideoViews = true;
    } else if (action == "downloads") {
      alertDeactivationDownloads = true;
    } else if (action == "boothChats") {
      alertDeactivationBoothChats = true;
    } else if (action == "videochatsPerBooth") {
      alertDeactivationVideochatsPerBooth = true;
    } else if (action == "all") {
      alertDeactivationAll = true;
    }
  }

  /**
   * @param {string} procent
   */
  function ProgressBar(procent) {
    valueProgressbar = procent;
  }
</script>

<div class="main-frame">
  <Tabs>
    <TabItem open title="Informations" on:click={() => ProgressBar("1")}>
      <form>
        <div class="grid gap-4 mb-4 md:grid-cols-2">
          <div>
            <Label>Event ID</Label>
            <Input type="number" id="event-id" required bind:value={eventId} />
          </div>
          <div>
            <Label>Booth ID</Label>
            <Input type="number" id="booth-id" required bind:value={boothId} />
          </div>
          <div>
            <Label>Prefix</Label>
            <Input type="text" id="prefix" required bind:value={prefix} />
          </div>
          <div>
            <Label>Event Name</Label>
            <Input
              type="text"
              id="event-name"
              required
              bind:value={eventName}
            />
          </div>
          <div>
            <Label>Profile 1</Label>
            <Input type="text" id="profile-1" bind:value={profile1} />
          </div>
          <div>
            <Label>Profile 1 Title</Label>
            <Input
              type="text"
              id="profile-1-title"
              bind:value={profile1title}
            />
          </div>
          <div>
            <Label>Profile 2</Label>
            <Input type="text" id="profile-2" bind:value={profile2} />
          </div>
          <div>
            <Label>Profile 2 Title</Label>
            <Input
              type="text"
              id="profile-2-title"
              bind:value={profile2title}
            />
          </div>
        </div>
      </form>
      <Button><Chevron>Language</Chevron></Button>
      <Dropdown>
        <DropdownItem on:click={() => (language = "EN")}>EN</DropdownItem>
        <DropdownItem on:click={() => (language = "DE")}>DE</DropdownItem>
      </Dropdown>
      <Button on:click={saveData} type="submit">Save</Button>
    </TabItem>

    <TabItem title="Actions" on:click={() => ProgressBar("50")}>
      <Tabs>
        <TabItem title="Full report">
          <Tabs>
            <TabItem title="Registration">
              <Tabs>
                <TabItem title="Registration">
                  <div>
                    {#if dropDownCounterRegister == 1}
                      <img src={chart8} alt="Chart 8" />
                      <div>
                        <P>Total registration</P>
                        <Button color="green" on:click={AddRegistrationTotal}>Enable</Button>
                        <Button color="red" on:click={RemoveRegistrationTotal}>Disable</Button>
                      </div>
                    {:else if dropDownCounterRegister == 2}
                      <img src={chart9} alt="Chart 9" />
                      <div>
                        <P>Total registration per day</P>
                        <Button color="green" on:click={AddRegistrationPerDay}>Enable</Button>
                        <Button color="red" on:click={RemoveRegistrationPerDay}>Disable</Button>
                      </div>
                    {:else if dropDownCounterRegister == 3}
                      <img src={chart10} alt="Chart 10" />
                      <div>
                        <P>Registration details</P>
                        <Button color="green" on:click={AddRegistrationDetails}>Enable</Button>
                        <Button color="red" on:click={RemoveRegistrationDetails}>Disable</Button>
                      </div>
                    {:else if dropDownCounterRegister == 4}
                      <div>
                        <P>All registration charts</P>
                        <Button color="green" on:click={AddAllRegistrationCharts}>Enable</Button>
                        <Button color="red" on:click={RemoveAllRegistrationCharts}>Disable</Button>
                      </div>
                    {/if}
                  </div>
                  <Button><Chevron>Charts</Chevron></Button>
                  <Dropdown>
                    <DropdownItem on:click={() => (dropDownCounterRegister = 1)}
                      >Total registration</DropdownItem
                    >
                    <DropdownItem on:click={() => (dropDownCounterRegister = 2)}
                      >Total registration per day</DropdownItem
                    >
                    <DropdownItem on:click={() => (dropDownCounterRegister = 3)}
                      >Registration details</DropdownItem
                    >
                    <DropdownItem on:click={() => (dropDownCounterRegister = 4)}
                      >All registration charts</DropdownItem
                    >
                  </Dropdown>
                </TabItem>

                <TabItem title="Registration & Logins">
                  <div>
                    {#if dropDownCounterRegisterLogin == 1}
                      <img src={chart11} alt="Chart 11" />
                      <div>
                        <P>Total registration (Total Confirmed)</P>
                        <Button color="green" on:click={AddRegistrationTotalConfirmed}>Enable</Button>
                        <Button color="red" on:click={RemoveRegistrationTotalConfirmed}>Disable</Button>
                      </div>
                    {:else if dropDownCounterRegisterLogin == 2}
                      <img src={chart12} alt="Chart 12" />
                      <div>
                        <P>Visitors (Total)</P>
                        <Button color="green" on:click={AddVisitorsTotal}>Enable</Button>
                        <Button color="red" on:click={RemoveVisitorsTotal}>Disable</Button>
                      </div>
                    {:else if dropDownCounterRegisterLogin == 3}
                      <img src={chart13} alt="Chart 13" />
                      <div>
                        <P>Logins per day (Total)</P>
                        <Button color="green" on:click={AddLoginPerDay}>Enable</Button>
                        <Button color="red" on:click={RemoveLoginPerDay}>Disable</Button>
                      </div>
                    {:else if dropDownCounterRegisterLogin == 4}
                      <img src={chart14} alt="Chart 14" />
                      <div>
                        <P>Logins per day (Unique user)</P>
                        <Button color="green" on:click={AddLoginPerDayUnique}>Enable</Button>
                        <Button color="red" on:click={RemoveLoginPerDayUnique}>Disable</Button>
                      </div>
                    {:else if dropDownCounterRegisterLogin == 5}
                      <img src={chart15} alt="Chart 15" />
                      <div>
                        <P>Visitors - Global</P>
                        <Button color="green" on:click={AddVisitorsRegional}>Enable</Button>
                        <Button color="red" on:click={RemoveVisitorsRegional}>Disable</Button>
                      </div>
                    {:else if dropDownCounterRegisterLogin == 6}
                      <img src={chart16} alt="Chart 16" />
                      <div>
                        <P>Visitors - Regional</P>
                        <Button color="green" on:click={AddVisitorsGlobal}>Enable</Button>
                        <Button color="red" on:click={RemoveVisitorsGlobal}>Disable</Button>
                      </div>
                    {:else if dropDownCounterRegisterLogin == 7}
                      <div>
                        <P>All Registration & Logins charts</P>
                        <Button color="green" on:click={AddAllRegistrationLoginCharts}>Enable</Button>
                        <Button color="red" on:click={RemoveAllRegistrationLoginCharts}>Disable</Button>
                      </div>
                    {/if}
                  </div>
                  <Button><Chevron>Charts</Chevron></Button>
                  <Dropdown>
                    <DropdownItem
                      on:click={() => (dropDownCounterRegisterLogin = 1)}
                      >Total registration (Total Confirmed)</DropdownItem
                    >
                    <DropdownItem
                      on:click={() => (dropDownCounterRegisterLogin = 2)}
                      >Visitors (Total)</DropdownItem
                    >
                    <DropdownItem
                      on:click={() => (dropDownCounterRegisterLogin = 3)}
                      >Logins per day (Total)</DropdownItem
                    >
                    <DropdownItem
                      on:click={() => (dropDownCounterRegisterLogin = 4)}
                      >Logins per day (Unique user)</DropdownItem
                    >
                    <DropdownItem
                      on:click={() => (dropDownCounterRegisterLogin = 5)}
                      >Visitors - Global </DropdownItem
                    >
                    <DropdownItem
                      on:click={() => (dropDownCounterRegisterLogin = 6)}
                      >Visitors - Regional</DropdownItem
                    >
                    <DropdownItem
                      on:click={() => (dropDownCounterRegisterLogin = 7)}
                      >All registration & login charts</DropdownItem
                    >
                  </Dropdown>
                </TabItem>
              </Tabs>
            </TabItem>
            <TabItem title="Event">
              <Tabs>
                <TabItem title="Participant Analysis">
                  <Button><Chevron>Charts</Chevron></Button>
                  <Dropdown>
                    <DropdownItem on:click={() => (dropDownCounterEvent1 = 1)}
                      >Chart 1</DropdownItem
                    >
                    <DropdownItem on:click={() => (dropDownCounterEvent1 = 2)}
                      >Chart 2</DropdownItem
                    >
                    <DropdownItem on:click={() => (dropDownCounterEvent1 = 3)}
                      >Chart 3</DropdownItem
                    >
                  </Dropdown>
                </TabItem>
                <TabItem title="Participant Activity">
                  <Button><Chevron>Charts</Chevron></Button>
                  <Dropdown>
                    <DropdownItem on:click={() => (dropDownCounterEvent2 = 1)}
                      >Chart 1</DropdownItem
                    >
                    <DropdownItem on:click={() => (dropDownCounterEvent2 = 2)}
                      >Chart 2</DropdownItem
                    >
                    <DropdownItem on:click={() => (dropDownCounterEvent2 = 3)}
                      >Chart 3</DropdownItem
                    >
                    <DropdownItem on:click={() => (dropDownCounterEvent2 = 4)}
                      >Chart 4</DropdownItem
                    >
                  </Dropdown>
                </TabItem>
                <TabItem title="Auditorium Activity">
                  <Button><Chevron>Charts</Chevron></Button>
                  <Dropdown>
                    <DropdownItem on:click={() => (dropDownCounterEvent3 = 1)}
                      >Chart 1</DropdownItem
                    >
                    <DropdownItem on:click={() => (dropDownCounterEvent3 = 2)}
                      >Chart 2</DropdownItem
                    >
                    <DropdownItem on:click={() => (dropDownCounterEvent3 = 3)}
                      >Chart 3</DropdownItem
                    >
                  </Dropdown>
                </TabItem>
              </Tabs>
            </TabItem>
            <TabItem title="Exhibitor">
              <div>
                {#if dropDownCounter == 1}
                  <img src={chart1} alt="Chart 1" />
                  <div>
                    <P>KPIs</P>
                    <Button color="green" on:click={AddKPIs}>Enable</Button>
                    <Button color="red" on:click={RemoveKPIs}>Disable</Button>
                  </div>
                {:else if dropDownCounter == 2}
                  <img src={chart2} alt="Chart 2" />
                  <div>
                    <P>Booth Visits Over Time</P>
                    <Button color="green" on:click={AddBoothVisitsOverTime}
                      >Enable</Button
                    >
                    <Button color="red" on:click={RemoveBoothVisitsOverTime}
                      >Disable</Button
                    >
                  </div>
                {:else if dropDownCounter == 3}
                  <img src={chart3} alt="Chart 3" />
                  <div>
                    <P>Booth Visits</P>
                    <Button color="green" on:click={AddBoothVisits}
                      >Enable</Button
                    >
                    <Button color="red" on:click={RemoveBoothVisits}
                      >Disable</Button
                    >
                  </div>
                {:else if dropDownCounter == 4}
                  <img src={chart4} alt="Chart 4" />
                  <div>
                    <P>Video Views</P>
                    <Button color="green" on:click={AddVideoViews}
                      >Enable</Button
                    >
                    <Button color="red" on:click={RemoveVideoViews}
                      >Disable</Button
                    >
                  </div>
                {:else if dropDownCounter == 5}
                  <img src={chart5} alt="Chart 5" />
                  <div>
                    <P>Downloads</P>
                    <Button color="green" on:click={AddDownloads}>Enable</Button
                    >
                    <Button color="red" on:click={RemoveDownloads}
                      >Disable</Button
                    >
                  </div>
                {:else if dropDownCounter == 6}
                  <img src={chart6} alt="Chart 6" />
                  <div>
                    <P>Booth Chats</P>
                    <Button color="green" on:click={AddBoothChats}
                      >Enable</Button
                    >
                    <Button color="red" on:click={RemoveBoothChats}
                      >Disable</Button
                    >
                  </div>
                {:else if dropDownCounter == 7}
                  <img src={chart7} alt="Chart 7" />
                  <div>
                    <P>Videochats per Booth</P>
                    <Button color="green" on:click={AddVideochatsPerBooth}
                      >Enable</Button
                    >
                    <Button color="red" on:click={RemoveVideochatsPerBooth}
                      >Disable</Button
                    >
                  </div>
                {:else if dropDownCounter == 8}
                  <div>
                    <P>All Charts</P>
                    <Button color="green" on:click={AddAll}>Add All</Button>
                    <Button color="red" on:click={RemoveAll}>Remove All</Button>
                  </div>
                {/if}
              </div>

              <br />

              <Button><Chevron>Charts</Chevron></Button>
              <Dropdown>
                <DropdownItem on:click={() => (dropDownCounter = 1)}
                  >KPIs</DropdownItem
                >
                <DropdownItem on:click={() => (dropDownCounter = 2)}
                  >Booth visits over time</DropdownItem
                >
                <DropdownItem on:click={() => (dropDownCounter = 3)}
                  >Booth Visits</DropdownItem
                >
                <DropdownItem on:click={() => (dropDownCounter = 4)}
                  >Video Views</DropdownItem
                >
                <DropdownItem on:click={() => (dropDownCounter = 5)}
                  >Downloads</DropdownItem
                >
                <DropdownItem on:click={() => (dropDownCounter = 6)}
                  >Booth Chats</DropdownItem
                >
                <DropdownItem on:click={() => (dropDownCounter = 7)}
                  >Videochats per Booth</DropdownItem
                >
                <DropdownItem on:click={() => (dropDownCounter = 8)}
                  >All Charts</DropdownItem
                >
              </Dropdown>
            </TabItem>
          </Tabs>
        </TabItem>
        <TabItem title="Charts">
          <div>
            {#if dropDownCounter == 1}
              <img src={chart1} alt="Chart 1" />
              <div>
                <P>KPIs</P>
                <Button color="green" on:click={AddKPIs}>Enable</Button>
                <Button color="red" on:click={RemoveKPIs}>Disable</Button>
              </div>
            {:else if dropDownCounter == 2}
              <img src={chart2} alt="Chart 2" />
              <div>
                <P>Booth Visits Over Time</P>
                <Button color="green" on:click={AddBoothVisitsOverTime}
                  >Enable</Button
                >
                <Button color="red" on:click={RemoveBoothVisitsOverTime}
                  >Disable</Button
                >
              </div>
            {:else if dropDownCounter == 3}
              <img src={chart3} alt="Chart 3" />
              <div>
                <P>Booth Visits</P>
                <Button color="green" on:click={AddBoothVisits}>Enable</Button>
                <Button color="red" on:click={RemoveBoothVisits}>Disable</Button
                >
              </div>
            {:else if dropDownCounter == 4}
              <img src={chart4} alt="Chart 4" />
              <div>
                <P>Video Views</P>
                <Button color="green" on:click={AddVideoViews}>Enable</Button>
                <Button color="red" on:click={RemoveVideoViews}>Disable</Button>
              </div>
            {:else if dropDownCounter == 5}
              <img src={chart5} alt="Chart 5" />
              <div>
                <P>Downloads</P>
                <Button color="green" on:click={AddDownloads}>Enable</Button>
                <Button color="red" on:click={RemoveDownloads}>Disable</Button>
              </div>
            {:else if dropDownCounter == 6}
              <img src={chart6} alt="Chart 6" />
              <div>
                <P>Booth Chats</P>
                <Button color="green" on:click={AddBoothChats}>Enable</Button>
                <Button color="red" on:click={RemoveBoothChats}>Disable</Button>
              </div>
            {:else if dropDownCounter == 7}
              <img src={chart7} alt="Chart 7" />
              <div>
                <P>Videochats per Booth</P>
                <Button color="green" on:click={AddVideochatsPerBooth}
                  >Enable</Button
                >
                <Button color="red" on:click={RemoveVideochatsPerBooth}
                  >Disable</Button
                >
              </div>
            {:else if dropDownCounter == 8}
              <div>
                <P>All Charts</P>
                <Button color="green" on:click={AddAll}>Add All</Button>
                <Button color="red" on:click={RemoveAll}>Remove All</Button>
              </div>
            {/if}
          </div>

          <br />

          <Button><Chevron>Charts</Chevron></Button>
          <Dropdown>
            <DropdownItem on:click={() => (dropDownCounter = 1)}
              >KPIs</DropdownItem
            >
            <DropdownItem on:click={() => (dropDownCounter = 2)}
              >Booth visits over time</DropdownItem
            >
            <DropdownItem on:click={() => (dropDownCounter = 3)}
              >Booth Visits</DropdownItem
            >
            <DropdownItem on:click={() => (dropDownCounter = 4)}
              >Video Views</DropdownItem
            >
            <DropdownItem on:click={() => (dropDownCounter = 5)}
              >Downloads</DropdownItem
            >
            <DropdownItem on:click={() => (dropDownCounter = 6)}
              >Booth Chats</DropdownItem
            >
            <DropdownItem on:click={() => (dropDownCounter = 7)}
              >Videochats per Booth</DropdownItem
            >
            <DropdownItem on:click={() => (dropDownCounter = 8)}
              >All Charts</DropdownItem
            >
          </Dropdown>
        </TabItem>
      </Tabs>
    </TabItem>

    <TabItem title="Edit">
      <div>
        <SortableList 
            {list} 
            key="id" 
            on:sort={sortList}
            let:item
            let:index
        >
            <Component {item} {index}/>
        </SortableList>
      </div>
    </TabItem>

    <TabItem on:click={() => ProgressBar("100")} title="Result">
      <div class="twobuttons">
        <Button color="red" on:click={resetData}>Reset</Button>
        <Button color="green" on:click={renderXML}>Render</Button>
      </div>
      {#if display}
        <div>
          <Label for="textarea-id" class="mb-2">Result:</Label>
          <P
            class="mb-3"
            weight="light"
            color="text-gray-500 dark:text-gray-400">{finalXML}</P
          >
          <Button color="green" on:click={copyToClipboard}>
            Copy to clipboard
          </Button>
        </div>
      {/if}
    </TabItem>
  </Tabs>

  {#if checkCopy}
    <div class="alert-copy">
      <Alert dismissable color="green">Content copied to clipboard!</Alert>
    </div>
  {/if}
  {#if dataSaved}
    <div class="alert-saved">
      <Alert dismissable color="blue"
        >Data have been correctly saved, please proceed to the next step.</Alert
      >
    </div>
  {/if}
  {#if alertAll}
    <div class="alerts">
      <Alert dismissable color="green">All the charts have been selected!</Alert
      >
    </div>
  {/if}
  {#if alertNone}
    <div class="alerts">
      <Alert dismissable color="red">No charts have been selected!</Alert>
    </div>
  {/if}
  {#if alertKPIs}
    <div class="alerts">
      <Alert dismissable color="green">KPIs chart has been selected!</Alert>
    </div>
  {/if}
  {#if alertBoothVisitsOverTime}
    <div class="alerts">
      <Alert dismissable color="green"
        >Booth visits over time chart has been selected!</Alert
      >
    </div>
  {/if}
  {#if alertBoothVisits}
    <div class="alerts">
      <Alert dismissable color="green"
        >Booth visits chart has been selected!</Alert
      >
    </div>
  {/if}
  {#if alertVideoViews}
    <div class="alerts">
      <Alert dismissable color="green"
        >Video views chart has been selected!</Alert
      >
    </div>
  {/if}
  {#if alertDownloads}
    <div class="alerts">
      <Alert dismissable color="green">Downloads chart has been selected!</Alert
      >
    </div>
  {/if}
  {#if alertBoothChats}
    <div class="alerts">
      <Alert dismissable color="green"
        >Booth chats chart has been selected!</Alert
      >
    </div>
  {/if}
  {#if alertVideochatsPerBooth}
    <div class="alerts">
      <Alert dismissable color="green"
        >Videochats per booth chart has been selected!</Alert
      >
    </div>
  {/if}
  {#if alertDeactivationAll}
    <div class="alerts">
      <Alert dismissable color="red"
        >All the charts have been deactivated!</Alert
      >
    </div>
  {/if}
  {#if alertDeactivationKPIs}
    <div class="alerts">
      <Alert dismissable color="red">KPIs chart has been deactivated!</Alert>
    </div>
  {/if}
  {#if alertDeactivationBoothVisitsOverTime}
    <div class="alerts">
      <Alert dismissable color="red"
        >Booth visits over time chart has been deactivated!</Alert
      >
    </div>
  {/if}
  {#if alertDeactivationBoothVisits}
    <div class="alerts">
      <Alert dismissable color="red"
        >Booth visits chart has been deactivated!</Alert
      >
    </div>
  {/if}
  {#if alertDeactivationVideoViews}
    <div class="alerts">
      <Alert dismissable color="red"
        >Video views chart has been deactivated!</Alert
      >
    </div>
  {/if}
  {#if alertDeactivationDownloads}
    <div class="alerts">
      <Alert dismissable color="red"
        >Downloads chart has been deactivated!</Alert
      >
    </div>
  {/if}
  {#if alertDeactivationBoothChats}
    <div class="alerts">
      <Alert dismissable color="red"
        >Booth chats chart has been deactivated!</Alert
      >
    </div>
  {/if}
  {#if alertDeactivationVideochatsPerBooth}
    <div class="alerts">
      <Alert dismissable color="red"
        >Videochats per booth chart has been deactivated!</Alert
      >
    </div>
  {/if}
</div>
<Progressbar class="progress-bar" progress={valueProgressbar} />

<style>
  .main-frame {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .twobuttons {
    justify-content: space-between;
    padding: 10px;
  }

  .alert-copy {
    animation: fadeIn 2s;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    z-index: 100;
  }

  .alert-saved {
    animation: fadeIn 2s;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    z-index: 100;
  }

  .alerts {
    animation: fadeIn 2s;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    z-index: 100;
  }

  .progress-bar {
    position: absolute;
    width: 100%;
    bottom: 0;
    right: 0;
    z-index: 100;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
