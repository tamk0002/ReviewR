/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
//global declarations
var rating = 0;
var stars = null;
let imageFile;
let reviewList = new Array();
let currentReview = 0;
let key = "tamk0002-reviewr";

document.addEventListener('deviceready', onDeviceReady);

function onDeviceReady(){
    
    let saveButton = document.getElementById("saveBtn");
    saveButton.addEventListener("click", saveReview);
    
    let cancelButton = document.getElementById("cancelBtn");
    cancelButton.addEventListener("click", cancelModal);
    
    let pictureButton = document.getElementById("cameraBtn");
    pictureButton.addEventListener("click", takePicture);
    
    let deleteButton = document.getElementById("deleteBtn");
    deleteButton.addEventListener("click", deleteReview);
    
    setStars();
    displayReviews();
    
}

function displayReviews(){
    
    getFromLS();
    let ul = document.getElementById("review-list");
    ul.innerHTML = "";
    
    let length = reviewList.length;
    
    for(let i = 0; i < length; i++){
        
        let li = document.createElement("li");
        li.className = "table-view-cell media";
        li.setAttribute("dataId", reviewList[i].id);
        
        let a = document.createElement("a");
        a.href = "#deleteReview"
        a.classList = "navigate-right";
        
        let div = document.createElement("div");
        div.classList = "media-body";
        
        let p = document.createElement("p");
        p.className = "name";
        p.textContent = reviewList[i].name;
        
        let img = document.createElement("img");
        img.classList = "media-object pull-left";
        img.src = reviewList[i].img;
        img.id = "displayedImage";
        
        div.appendChild(p);
        
        let starLength = reviewList[i].rating;
        
        for(let n = 0; n < starLength; n++){
            let spanRating = document.createElement("span");
            spanRating.classList = "star";
            //spanRating.textContent = "&nbsp;";
            div.appendChild(spanRating);
        }
        
        a.addEventListener("touchstart", storedReviews);
        
        a.appendChild(img);
        a.appendChild(div);
        li.appendChild(a);
        ul.appendChild(li);
    }
}

function cancelModal(){
    
    document.getElementById("item").value = "";
    value = 0;
    document.getElementById("myImage").src = "";
    setStars();
    var endEvent = new CustomEvent('touchend', {bubbles:true, cancelable:true});
    var a = document.querySelector("a#xBtn");
    a.dispatchEvent(endEvent);
}

function takePicture(){
    
    var options = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.PNG,
        mediaType: Camera.MediaType.PICTURE,
        pictureSourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        targetWidth: 300,
        targetHeight: 300
    }
    navigator.camera.getPicture( onSuccess, onFail, options ); 
}

function saveReview(){
    
    let savingItem = document.getElementById("item").value;
    let savingRating = rating;
    imageFile = document.getElementById("myImage").src;
    let timeStamp = new Date().getTime() / 1000;
    
    let review = {id: timeStamp,
                  name:savingItem,
                  rating:savingRating,
                  img:imageFile,
                 };
    
    reviewList.push(review);
    saveToLS();
    cancelModal();
    displayReviews();
}

function saveToLS(){
    localStorage.setItem(key, JSON.stringify(reviewList));
}

function getFromLS(){
    if(!localStorage.getItem(key)){
        console.log("No data found");
    }
    else{
        reviewList = JSON.parse(localStorage.getItem(key));
    }
}

function storedReviews(ev){
    
    currentReview = ev.target.parentElement.attributes.dataId.nodeValue;
    document.getElementById("closeDeleteMenu").addEventListener("touchstart", function(){
        document.getElementById("itemDisplay").textContent = "";
        document.getElementById("displayPhoto").src = "";
        value = 0;
    })
    
    
    let length = reviewList.length;
    
    for(let i = 0; i < length; i++){
        if(currentReview == reviewList[i].id){
            
            document.getElementById("itemDisplay").textContent = "Item: " + reviewList[i].name;
            document.getElementById("displayPhoto").src = reviewList[i].img;
            document.getElementById("starsRating").innerHTML="";
            
            let lengthStars = reviewList[i].rating;
            for(let n = 0; n < lengthStars; n++){
                let spanRating = document.createElement("span");
                spanRating.classList = "star";
                //spanRating.textContent = "&nbsp;";
                document.getElementById("starsRating").appendChild(spanRating);
            }
            break;
        }
    }
}

function deleteReview(){
    
    let length = reviewList.length;
    for(let i = 0; i < length; i++){
        if(currentReview == reviewList[i].id){
            reviewList.splice(i,1);
            console.log(reviewList);
            break;
        }
    }
    
    document.getElementById("itemDisplay").textContent = "";
    document.getElementById("displayPhoto").src = "";
    document.getElementById("starsRating").innerHTML = "";
    value = 0;
    
    saveToLS();
    displayReviews();
    
    var endEvent = new CustomEvent('touchend', {bubbles:true, cancelable:true});
    var a = document.querySelector("#closeDeleteMenu");
    a.dispatchEvent(endEvent);
}

function setStars(){
    stars = document.querySelectorAll('.star');
    addListeners();
    setRating(); //based on global rating variable value
}

function onSuccess(imageURI) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageURI;
}

function onFail(message) {
    alert('Failed because: ' + message);
}

function addListeners(){
  [].forEach.call(stars, function(star, index){
    star.addEventListener('click', (function(idx){
      console.log('adding listener', index);
      return function(){
        rating = idx + 1;  
        console.log('Rating is now', rating)
        setRating();
      }
    })(index));
  });
}

function setRating(){
  [].forEach.call(stars, function(star, index){
    if(rating > index){
      star.classList.add('rated');
      console.log('added rated on', index );
    }else{
      star.classList.remove('rated');
      console.log('removed rated on', index );
    }
  });
}