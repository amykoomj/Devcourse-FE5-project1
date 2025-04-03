export default function Sidebar({ $app, initialState }) {
  this.state = initialState;

  this.$target = document.createElement("div");
  this.$target.className = "sideBar";
  $app.appendChild(this.$target);

  this.template = () => {
    let temp = `
      <div class="sideBar">
            <div class="header">
                <div class="profile">
                    <img class="picture">
                    <div class="name">Devcourse</div>
                    <div class="description">FE5 1차 팀프로젝트</div>
                </div>
                <button class="setting">설정</button>
            </div>
            <form class="search">
                <img>
                <input type="text" placeholder="검색">
            </form>
            <div class="documents">
                <ul></ul>
            </div>
            <div class="footer">
                <button class="addPage"><img>페이지 추가</button>
                <div class="info">?</div>
            </div>
      </div>
    `;
    return temp;
  };

  this.render = () => {
    this.$target.innerHTML = this.template();
  
    const addPage = this.$target.querySelector('.addPage');
    const documentList = this.$target.querySelector('.documents ul');
    const searchInput= this.$target.querySelector('.search input');

    addPage.addEventListener('click',async()=>{
      await fetchData(documentList);      
    })

    searchInput.addEventListener('input',filter);

  };
    
  const fetchData = async (documentList)=>{
    try {
        const response = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "x-username": "team_01", //
          },
          body: JSON.stringify({
              title: "파일 제목",
              parent: null,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok!");
        }

        const data = await response.json();
        
        const newDocument = document.createElement('li');
        const documentLink = document.createElement('a');
        documentLink.href=`${data.id}`;
        documentLink.textContent=data.title;
        newDocument.appendChild(documentLink);
        
        if(documentList){
          documentList.appendChild(newDocument);
        }        
    } catch (error) {
        console.error(error);
    }
  };
  //a href 의 textContent가 제목이니까 forEach로 일치하면 보이도록(on활용해야하나?)
  const filter=()=>{
    const searchTerm=searchInput.value.trim().toLowerCase(); //띄어쓰기 상관없이
    const links=Array.from(documentList.querySelectorAll("li"));
    links.forEach(link=>{
      const pageTitle=link.getElementsByTagName("a").textContent.toLowerCase();
      link.style.display=pageTitle.includes(searchTerm) ? "":'none';
    });
  };


  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };
}