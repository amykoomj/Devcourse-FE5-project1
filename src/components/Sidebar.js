export default function Sidebar({ $app, initialState }) {
  this.state = initialState;

  this.$target = document.createElement("div");
  this.$target.className = "sideBar";
  $app.appendChild(this.$target);

  this.template = () => {
    let temp = `
      <div class="sideBar">
            <div class="header">
                <img class="picture" src="./images/profile.png" />
                <div class="profile">
                  <div class="name">Devcourse</div>
                  <div class="description">FE5 1차 팀프로젝트</div>
                </div>
<!--                 <button class="setting"></button> -->
            </div>
            <form class="search">
                <input type="text" placeholder="검색">
            </form>
            <div class="documents">
                <ul>
                </ul>
            </div>
            <div class="footer">
                <button class="addPage">페이지 추가</button>
                <div class="info">
                    <div class="none">
                        2025.04.04 / Team 1 <br>
                        강하영, 구민지, 권유정, 박상윤, 주경록, 한상아
                    </div>
                </div>
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
    });

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
        documentLink.href=`./documents/${data.id}`;//
        documentLink.textContent=data.title;
        newDocument.appendChild(documentLink);
        
        if(documentList){
          documentList.appendChild(newDocument);
        }        
    } catch (error) {
        console.error(error);
    }
  };
  
  const filter=()=>{
    const searchInput = this.$target.querySelector(".search input");
    const documentList = this.$target.querySelector(".documents ul");

    const searchTerm=searchInput.value.trim().toLowerCase(); 
    const links=Array.from(documentList.querySelectorAll("li"));
    links.forEach((link)=>{
      const documentLink=link.querySelector("a");
      if(!documentLink) return;

      const pageTitle=documentLink.textContent.toLowerCase();
      link.style.display=pageTitle.includes(searchTerm) ? "":"none";
    });
  };


  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}