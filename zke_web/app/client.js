
const appConfig = {
    apiUrlDivinationStart : 'http://45.32.8.253:4000/divination/start',
    apiUrlDivinationConsult : 'http://45.32.8.253:4000/divination/consult',
    userId : generate36DigitRandomNumber(),
    key : "9757e4cb-4019-420a-be24-4ce5a4cf03bf",
    confusionLimit : 0,
}

const elementID = {
    loadingDiv : 'loadingDiv',
    rootPage : 'root_page',
    talkBox : 'talk_box',
    confusionButton : 'confusion_button',
}

let but = document.getElementById("submitButton_for_hexagram");
but.addEventListener("click", start_divination);

function start_divination(){

    let hexagram_list = ["hexagram1", "hexagram2", "hexagram3", "hexagram4", "hexagram5", "hexagram6"];
    let hexagram_result = "";
    let confusion_text;

    let confusion_elem = document.getElementById("confusion_text");
    confusion_text = confusion_elem.value;

    hexagram_list.forEach(function(hexagram_id){
        checkbox = document.getElementById(hexagram_id);
        if (checkbox.checked){
            hexagram_result += "阳";
        } else {
            hexagram_result += "阴";
        }
    });

    // into next page
    let talk_box = document.getElementById(elementID.talkBox);
    talk_box.remove();
    divination_start(hexagram_result, confusion_text);
}

function get_divination_confusion(){
    let confusion_elem = document.getElementById("user_text");
    let confusion_text = confusion_elem.value;

    removeTalkBox();
    divination_confusion(confusion_text);
}


function divination_start(hexagram, question){
    rootPage = document.getElementById(elementID.rootPage);
    createLoadingDiv(rootPage);

    // 定义请求的URL
    const url = appConfig.apiUrlDivinationStart;

    // 创建将要发送的数据
    const data = {
        key: appConfig.key,
        user_id: appConfig.userId,
        hexagram: hexagram,
        question: question
    };

    // 使用fetch API发起POST请求
    fetch(url, {
        method: 'POST', // 指定请求方法为POST
        headers: {
            'Content-Type': 'application/json', // 指定发送的数据类型为JSON
        },
        body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
    })
    .then(response => {
        if (!response.ok) {
            let data = response.json();
            return data
            .then(data => {
                removeLoadingDiv();
                createErrPage(data.detail)
                throw new Error("ERR_HAPPENED_SUCCESS");
            })
        }
        return response.json();
    })
    .then(data => {
        removeLoadingDiv();
        createTalkBox(data.master, rootPage, get_divination_confusion);
    })
    .catch(error => {
        if (error.message == "ERR_HAPPENED_SUCCESS"){
            return;
        }
        alert("占卜错误 请检查您的网络连接 页面即将刷新");
        //refresh page
        location.reload();
    });
}

function divination_confusion(question){
    rootPage = document.getElementById(elementID.rootPage);
    createLoadingDiv(rootPage);
    // 定义请求的URL
    const url = appConfig.apiUrlDivinationConsult;

    // 创建将要发送的数据
    const data = {
        key: appConfig.key,
        user_id: appConfig.userId,
        question: question
    };

    // 使用fetch API发起POST请求
    fetch(url, {
    method: 'POST', // 指定请求方法为POST
    headers: {
            'Content-Type': 'application/json', // 指定发送的数据类型为JSON
        },
        body: JSON.stringify(data), // 将JavaScript对象转换为JSON字符串
    })
    .then(response => {
        if (!response.ok) {
            let data = response.json();
            return data
            .then(data => {
                removeLoadingDiv();
                createErrPage(data.detail)
                throw new Error("ERR_HAPPENED_SUCCESS");
            })
        }
        return response.json();
    })
    .then(data => {
        removeLoadingDiv();
        createTalkBox(data.master, rootPage, get_divination_confusion)
    })
    .catch(error => {
        if (error.message == "ERR_HAPPENED_SUCCESS"){
            return;
        }
        alert("占卜错误 请检查您的网络连接 页面即将刷新");
        //refresh page
        location.reload();
    });
}


function removeLoadingDiv() {
    // Get the loading page
    let loadingDiv = document.getElementById(elementID.loadingDiv);
    // Remove the loading page
    loadingDiv.remove();
}

// Function to create the loading page
function createLoadingDiv(parentElement) {
    // Create the container div for the loading animation
    let loadingDiv = document.createElement('div');
    loadingDiv.setAttribute("id", elementID.loadingDiv);
    loadingDiv.className = 'flex flex-col items-center justify-center';

    // Create the animation div
    let spinnerDiv = document.createElement('div');
    spinnerDiv.className = 'animate-spin rounded-full h-32 w-32 border-b-4 border-gray-900';

    // Create the text paragraph
    let textP = document.createElement('p');
    textP.className = 'text-lg text-gray-700 mt-4';
    textP.textContent = '占卜中...';

    // Append the spinner and text to the container
    loadingDiv.appendChild(spinnerDiv);
    loadingDiv.appendChild(textP);

    parentElement.appendChild(loadingDiv);
}

function removeTalkBox(){
    let talk_box = document.getElementById(elementID.talkBox);
    talk_box.remove();
}

function createTalkBox(ai_message, parentElement, callback){
    appConfig.confusionLimit += 1;

    let talk_box = document.createElement("div");
    talk_box.setAttribute("id", elementID.talkBox);
    talk_box.setAttribute("class", "flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl max-w-screen-md");

    let topic = document.createElement("p");
    topic.textContent = "赵乾坤所述"
    topic.setAttribute("class", "text-2xl text-center text-neutral-900");

    let ai_text = document.createElement("p");
    ai_text.setAttribute("id", "ai_text");
    ai_text.textContent = ai_message;
    ai_text.setAttribute("class", "text-lg text-center text-neutral-900");

    let user_text = document.createElement("textarea");
    user_text.setAttribute("id", "user_text");
    user_text.setAttribute("class", "text-center text-neutral-900 w-4/5 rounded-lg shadow-md");

    let submit_button = document.createElement("button");
    submit_button.setAttribute("id", elementID.confusionButton);
    submit_button.setAttribute("class", "text-lg text-center text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-8 py-2 rounded-lg shadow-md");
    submit_button.textContent = `第${appConfig.confusionLimit}次请示`;


    talk_box.appendChild(topic);
    talk_box.appendChild(ai_text);
    if (appConfig.confusionLimit < 4){
        talk_box.appendChild(user_text);
        talk_box.appendChild(submit_button);
        submit_button.addEventListener("click", callback);
    }
    parentElement.appendChild(talk_box);
}


function createErrPage(data){
    let talk_box = document.createElement("div");
    talk_box.setAttribute("id", elementID.talkBox);
    talk_box.setAttribute("class", "flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl max-w-screen-md");

    let topic = document.createElement("p");
    topic.textContent = "占卜错误"
    topic.setAttribute("class", "text-2xl text-center text-neutral-900");

    let message = document.createElement("p");
    message.setAttribute("class", "text-xl text-center text-neutral-900");

    console.log(data);
    if (data[0].includes("String should have at least 2 characters")){
        message.textContent = "你的请示或卜问没有意义 请写完整";
    } else if (data[0].includes("String should have at most 50 characters")){
        message.textContent = "卜问 简要描述你的困惑 50字以内就足够了";
    } else if (data[0].includes("String should have at most 200 characters")){
        message.textContent = "请示 简要描述你的困惑 200字以内就足够了";
    } else {
        message.textContent = data[0];
    }

    let button = document.createElement("button");
    button.setAttribute("id", "refresh_button");
    button.setAttribute("class", "text-lg text-center text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-8 py-2 rounded-lg shadow-md");
    button.textContent = "重新开始占卜";

    button.addEventListener("click", function(){
        location.reload();
    });
    
    talk_box.appendChild(topic);
    talk_box.appendChild(message);
    talk_box.appendChild(button);
    let rootPage = document.getElementById(elementID.rootPage);
    rootPage.appendChild(talk_box);

}


function generate36DigitRandomNumber() {
    let randomNumber = '';
    for(let i = 0; i < 36; i++) {
      let digit = Math.floor(Math.random() * 10); // generates a number between 0 and 9
      randomNumber += digit.toString();
    }
    return randomNumber;
  }
  