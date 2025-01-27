
import { savePost, postCollection, likes, getUserLogged, deletePost } from '../lib/index.js';
import { onSnapshot, 
// eslint-disable-next-line import/no-unresolved
} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';
// eslint-disable-next-line import/no-cycle
import { auth } from '../lib/authUser.js';

// Dashboard base
export const Dashboard = () => {
  const htmlDashboard = `

    <div class="provisionalDashboard">
        <form class="postForm" id="postCreatorForm">
            <label for="productPostReview">¿Qué producto recomendarás hoy?</label>
            <textarea required id ="productReview" name="textarea" rows="10" cols="40" autofocus></textarea>

            <button type="submit" class="mainButton" id="buttonCreatePost">Publicar</button>
        </form>
        
        <div class="posts-container" id="postsContainer">
 
        </div>
    </div>

    `;

  const divDashboard = document.createElement('div');
  divDashboard.innerHTML = htmlDashboard;

  // Botón para publicar post
  const btnNewPost = divDashboard.querySelector('#buttonCreatePost');
  btnNewPost.addEventListener('click', (e) => {
    e.preventDefault();
    const inputPost = document.getElementById('productReview').value;
    savePost(inputPost);
  });

  // Feed de posts en pantalla Dashboard
  const dashboardPosts = divDashboard.querySelector("#postsContainer");
  onSnapshot(postCollection, (querySnapshot) => {
    
    let feedPosts = [];
    if (querySnapshot.metadata.hasPendingWrites === false) {
      dashboardPosts.innerHTML = "";
      querySnapshot.forEach((doc) => {
        feedPosts.push({ id: doc.id, infopost: doc.data().post });

// console.log("obteniendo email en doc >>>", doc.data().email);
// console.log("Obteniendo usuario >>>", auth.currentUser.email);

        let user = doc.data().email;
        let post = doc.data().post; 
        let likes = doc.data().likes;

      dashboardPosts.innerHTML += `
        <div class="div-post">
          <section class="postHead">
            <div class="userDetail">
              <p id="userID">${user}</p>
            </div>
            <div>
              <button id="editButton" style="display:${auth.currentUser.email === doc.data().email ? "block" : "none"}">Editar</button>
            </div>  
          </section>
          <section class="postBody">
            <div>
              <p id="postContent">${post}</p>
            </div>
          </section>
          <section class="postFooter">
             <div>
              <p id="likesCounter">aquivanloslikes</p>
              <button class="likeButton" value="${doc.id}">o</button>
              <button id="deleteButton" style="display:${auth.currentUser.email === doc.data().email ? "block" : "none"}">imgbotedebasura</button>
            </div>
          </section>
        </div>
          `;

          const btnDeletePost = dashboardPosts.querySelectorAll('.deleteButton');
          btnDeletePost.forEach((btn) => {
            // eslint-disable-next-line func-names
            btn.addEventListener('click', () => {
              deletePost(btn.value);
              console.log(btn.value);
            });
		 });
      });
    }
  });

  // Botón para dar like a post
  const addLikeButton = divDashboard.querySelectorAll('#likeButton');
    addLikeButton.forEach((btn) => {
      btn.addEventListener('click', function () {
        const dataID = this.getAttribute('data-id');
        likes(dataID);


      });
    });
  
  return divDashboard;

};
