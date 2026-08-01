document.addEventListener("DOMContentLoaded", function(){

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

const totalCount = document.getElementById("totalCount");
const favoriteCount = document.getElementById("favoriteCount");
const cppCount = document.getElementById("cppCount");
const pythonCount = document.getElementById("pythonCount");

const themeBtn = document.getElementById("themeBtn");
const toast = document.getElementById("toast");

const button = document.getElementById("addSnippetBtn");
const popup = document.getElementById("popup");
const saveBtn = document.getElementById("saveBtn");

const titleInput = document.getElementById("titleInput");
const codeInput = document.getElementById("codeInput");
const languageInput = document.getElementById("languageInput");
const categoryInput = document.getElementById("categoryInput");

const snippetsContainer = document.getElementById("snippetsContainer");
const searchInput = document.getElementById("searchInput");
const favoriteFilter = document.getElementById("favoriteFilter");
const emptyMessage = document.getElementById("emptyMessage");


let snippets = JSON.parse(localStorage.getItem("snippets")) || [];
let editIndex = null;



function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(function(){

        toast.classList.remove("show");

    },2000);

}



button.addEventListener("click", function(){

    popup.style.display="block";

});




function createSnippetCard(snippet){


    const card=document.createElement("div");

    card.className="snippet-card";

   let prismLanguage = snippet.language.toLowerCase();

if (prismLanguage === "c++") prismLanguage = "cpp";
if (prismLanguage === "javascript") prismLanguage = "javascript";

card.innerHTML = `

<h2>${snippet.title}</h2>

<p><strong>Language:</strong> ${snippet.language}</p>

<p><strong>Category:</strong> ${snippet.category}</p>

<p><strong>Code:</strong></p>

<pre><code class="language-${prismLanguage}">
${snippet.code}
</code></pre>

<button class="favorite-btn">
${snippet.favorite ? "⭐ Favorited" : "⭐ Favorite"}
</button>

<button class="copy-btn">
Copy Code
</button>

<button class="edit-btn">
Edit
</button>

<button class="delete-btn">
Delete
</button>

`;
    
    snippetsContainer.appendChild(card);
    Prism.highlightElement(card.querySelector("code"));

    emptyMessage.style.display="none";



    const copyButton=card.querySelector(".copy-btn");


    copyButton.addEventListener("click",function(){

        navigator.clipboard.writeText(snippet.code);

        showToast("📋 Code Copied");

    });




    const favoriteButton=card.querySelector(".favorite-btn");


    favoriteButton.addEventListener("click",function(){


        snippet.favorite=!snippet.favorite;


        favoriteButton.textContent=
        snippet.favorite ?
        "⭐ Favorited":
        "⭐ Favorite";


        localStorage.setItem(
            "snippets",
            JSON.stringify(snippets)
        );


        updateDashboard();


        showToast(
            snippet.favorite ?
            "⭐ Added to Favorites":
            "❌ Removed from Favorites"
        );

    });



    
    const editButton=card.querySelector(".edit-btn");


    editButton.addEventListener("click",function(){


        titleInput.value=snippet.title;

        languageInput.value=snippet.language;

        categoryInput.value=snippet.category;

        codeInput.value=snippet.code;


        editIndex=snippets.indexOf(snippet);


        popup.style.display="block";


    });





    const deleteButton=card.querySelector(".delete-btn");


    deleteButton.addEventListener("click",function(){


        card.remove();


        snippets=snippets.filter(function(item){

            return item!==snippet;

        });


        localStorage.setItem(
            "snippets",
            JSON.stringify(snippets)
        );


        updateDashboard();


        showToast("🗑️ Snippet Deleted");


    });



}



saveBtn.addEventListener("click",function(){


const title=titleInput.value;
const language=languageInput.value;
const category=categoryInput.value;
const code=codeInput.value;



if(
title==="" ||
language==="" ||
category==="" ||
code===""
){

    showToast("⚠️ Please fill all fields!");

    return;

}



const snippet={

    title,
    language,
    category,
    code,
    favorite:false

};



if(editIndex===null){

    snippets.push(snippet);

}
else{

    snippets[editIndex]=snippet;

    editIndex=null;

}



localStorage.setItem(
"snippets",
JSON.stringify(snippets)
);



createSnippetCard(snippet);


updateDashboard();



titleInput.value="";
codeInput.value="";


popup.style.display="none";


showToast("✅ Snippet Saved");


});


snippets.forEach(function(snippet){

    createSnippetCard(snippet);

});



searchInput.addEventListener("input",function(){


let text=searchInput.value.toLowerCase();


document.querySelectorAll(".snippet-card")
.forEach(function(card){


if(card.textContent.toLowerCase().includes(text)){

card.style.display="block";

}
else{

card.style.display="none";

}


});


});



document.querySelectorAll(".filter-btn")
.forEach(function(btn){


btn.addEventListener("click",function(){


let lang=btn.dataset.language;


document.querySelectorAll(".snippet-card")
.forEach(function(card){


if(lang==="All" ||
card.textContent.includes(lang)){

card.style.display="block";

}
else{

card.style.display="none";

}


});


});


});




themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeBtn.textContent = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }

});


if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️ Light Mode";

} else {

    themeBtn.textContent = "🌙 Dark Mode";

}




function updateDashboard(){


totalCount.textContent=snippets.length;


favoriteCount.textContent=
snippets.filter(s=>s.favorite).length;


cppCount.textContent=
snippets.filter(s=>s.language==="C++").length;


pythonCount.textContent=
snippets.filter(s=>s.language==="Python").length;


}


updateDashboard();



exportBtn.addEventListener("click",function(){


const blob=new Blob(
[
JSON.stringify(snippets)
],
{
type:"application/json"
}
);


const link=document.createElement("a");


link.href=URL.createObjectURL(blob);


link.download="codevault-backup.json";


link.click();


showToast("📤 Backup Exported");


});



importBtn.addEventListener("click",function(){

importFile.click();

});



importFile.addEventListener("change",function(e){


const file=e.target.files[0];


const reader=new FileReader();


reader.onload=function(){


snippets=JSON.parse(reader.result);


localStorage.setItem(
"snippets",
JSON.stringify(snippets)
);


location.reload();


};


reader.readAsText(file);


});

});