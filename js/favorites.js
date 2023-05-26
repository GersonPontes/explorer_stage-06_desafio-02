import gitHubUser from "./gitHubUser.js"

class Favorites{
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem("github-favorites")) || []
  }

  delete(user){
    this.entries = this.entries
    .filter(entry => entry.login !== user.login)
    this.update()
    this.save()
  }
}

export default class FavoritesView extends Favorites{
  constructor(root){
    super(root)
    this.tbody = this.root.querySelector("table tbody")
    this.update()
    this.onAdd()
  }

  async add(userName){
    try{

      const userExists = this.entries.find(entry => entry.login == userName)

      if(userExists){
        throw new Error("Usúario já cadastrado!")
      }

      const user = await gitHubUser.search(userName)

      if(user.login === undefined){
        throw new Error("Usúario não encontrado!")
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    }catch(error){
      alert(error.message)
    }
    
  }

  onAdd(){
    const addButton = this.root.querySelector(".btn-search")
    addButton.onclick = () => {
      const {value} = this.root.querySelector("#input-search")
      this.add(value)
    }
  }

  save(){
    localStorage.setItem("github-favorites", JSON.stringify(this.entries))
  }

  update(){
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector(".user img").src = `https://github.com/${user.login}.png`
      row.querySelector(".user a").href = `https://github.com/${user.login}`
      row.querySelector(".user p").textContent = user.name
      row.querySelector(".user span").textContent = `/${user.login}`
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers
      row.querySelector(".user-delete").onclick = (event) => {
        event.preventDefault()
        const isOk = confirm("Tem certeza que deseja deletar essa linha?")
      
        if(isOk){
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow(){
    const tr = document.createElement("tr")
    tr.innerHTML = 
    `
      <td class="user">
        <img src="" alt="">
        <div>
          <a href="">
            <p></p>
            <span></span>
          </a>
        </div>
      </td>
      <td class="repositories"></td>
      <td class="followers"></td>
      <td><a href="" class="user-delete">Remover</a></td>
    `
    return tr
  }

  removeAllTr(){
    this.tbody.querySelectorAll("tr")
    .forEach(tr => {
      tr.remove()
    })
  }
}