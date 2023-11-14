

window.user_id = generate36DigitRandomNumber();

function generateYinYang() {
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += Math.random() < 0.5 ? '阴' : '阳';
    }
    return result;
}

function ErrorPage({message}){
    return(
        <div className="flex flex-col gap-4 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p className="text-2xl text-center text-neutral-900">
                占卜错误
            </p>
            <p className="text-xl text-center text-neutral-900">
                {message}
            </p>
        </div>
    )
}

function SayGoodbye({jumpToStart}){
    return(
        <div className="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p className="text-2xl font-bold text-center">
                时机成熟时 欢迎您再来寻求占卜指引
            </p>
            <button onClick={jumpToStart} className="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                结束占卜
            </button>
        </div>
    )
}

function QandA({msg, aftquestion, questionNum}){
    const [questionInput, setQuestionInput] = React.useState("");
    function onChange(event){
        setQuestionInput(event.target.value);
    }

    return(
        <div className="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p className="text-2xl font-bold text-center">
                段乾坤所述
            </p>
            <p className="text-xl font-bold text-center">
                {msg}
            </p>
            {questionNum < 3 && <textarea value = {questionInput} onChange={onChange} ></textarea>}
            {questionNum < 3 && 
            <button onClick={()=>aftquestion(questionInput)} className="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                继续请示 第{questionNum+1}次
            </button>}

        </div>
    )
}

function HexagramQuestion({setQuestion}){
    const [questionInput, setQuestionInput] = React.useState("");
    function onChange(event){
        setQuestionInput(event.target.value);
    }

    function submitQuestion(){
        setQuestion(questionInput);
    }

    return(
        <div className="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p className="text-2xl font-bold text-center">
                接下来 请输入你的困惑和疑问
            </p>
            <input className="rounded-md border-gray-500" type="text" placeholder="卜问" value={questionInput} onChange={onChange}/>
            <button onClick={submitQuestion} className="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                求解卦象
            </button>
        </div>
    )
}

function TutorialResult({hexagram, onClick}){
    
    let hexagramTitle = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
    return(
        <div className="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p className="text-2xl font-bold text-center">
                卦象
            </p>
            {Array.from(hexagram).map((char, index)=>{
                return(
                    <p key={index} className="text-xl font-bold text-center">
                        {hexagramTitle[index]} {char}
                    </p>
                )
            })}
            <button onClick={onClick} className="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                输入卜问
            </button>
        </div>
    )
}

function TutorialUser({round, addHexagram}){

    return(
        <div className="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p className="text-2xl font-bold text-center">
                第{round}次投掷
            </p>
            <p className="text-xl font-bold text-center">
                心中默念自己的困惑 投出三枚硬币 勾选正面朝上的硬币
            </p>
            <div className="flex flex-row gap-16 justify-center">
                <button className="text-slate-800 text-xl font-bold text-center hover:text-blue-600"
                    onClick={()=>addHexagram("阴")}>
                    没有
                </button>
                <button className="text-slate-800 text-xl font-bold text-center hover:text-blue-600"
                    onClick={()=>addHexagram("阳")}>
                    一个
                </button>
                <button className="text-slate-800 text-xl font-bold text-center hover:text-blue-600"
                    onClick={()=>addHexagram("阴")}>
                    两个
                </button>
                <button className="text-slate-800 text-xl font-bold text-center hover:text-blue-600"
                    onClick={()=>addHexagram("阳")}>
                    三个
                </button>
            </div>
        </div>
    )
}

function Tutorial02({jumpToEndPage, jumpToRes}){
    return(
        <div className="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p className="text-2xl font-bold text-center">
                我将代你生成卦象 你愿意由我代你投掷吗？
            </p>
            <div className="flex flex-row gap-24 justify-center">
                <button onClick={jumpToRes} className="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    愿意
                </button>
                <button onClick={jumpToEndPage} className="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    不愿意
                </button>
            </div>
        </div>
    )
}

function Tutorial01({goToNextPage, jumpToTu2}){
    return(
        <div className="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p className="text-2xl font-bold text-center">
                你身旁有三枚相同的硬币吗？
            </p>
            <div className="flex flex-row gap-24 justify-center">
                <button onClick={goToNextPage} className="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    我有
                </button>
                <button onClick={jumpToTu2} className="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    我没有
                </button>
            </div>
        </div>
    )
}

function Sayhello3({goToNextPage, jumpToEndPage}){
    return(
        <div className="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p className="text-2xl font-bold text-center">
                你准备好了吗?
            </p>
            <div className="flex flex-row gap-8 justify-center">
                <button onClick={goToNextPage} className="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    开始占卜
                </button>
                <button onClick={jumpToEndPage} className="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    稍后继续
                </button>
            </div>
        </div>
    )
}

function Sayhello2({onClick}){
    return(
        <button onClick={onClick} className="flex flex-col gap-2 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl hover:shadow-2xl">
            <p className="text-2xl font-bold text-center">
                只有遇到真正的困惑
            </p>
            <p className="text-2xl font-bold text-center">
                才能得到相应的答案
            </p>
        </button>
    )
}

function Sayhello1({onClick}){
    return(
        <button onClick={onClick} className="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl hover:shadow-2xl">
            <p className="text-3xl font-bold text-center">
                段乾坤 周易八卦 占卜屋
            </p>
        </button>
    )
}

function generate36DigitRandomNumber() {
    let randomNumber = '';
    for(let i = 0; i < 36; i++) {
      let digit = Math.floor(Math.random() * 10); // generates a number between 0 and 9
      randomNumber += digit.toString();
    }
    return randomNumber;
  }
  

function divination_start(hexagram, question, sucCallBack, errCallBack){
    // 定义请求的URL
    const url = 'http://45.32.8.253:5000/divination/start';

    // 创建将要发送的数据
    const data = {
        key: "4c3b427b-4dfa-4da8-bc9f-746a6bc32999",
        user_id: window.user_id,
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
                errCallBack(data.detail);
                throw new Error("ERR_HAPPENED_SUCCESS");
            })
        }
        return response.json();
    })
    .then(data => {
        sucCallBack(data.master);
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


function divination_confusion(question, sucCallBack, errCallBack){
    // 定义请求的URL
    const url = 'http://45.32.8.253:5000/divination/consult';

    // 创建将要发送的数据
    const data = {
        key: "4c3b427b-4dfa-4da8-bc9f-746a6bc32999",
        user_id: window.user_id,
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
                errCallBack(data.detail);
                throw new Error("ERR_HAPPENED_SUCCESS");
            })
        }
        return response.json();
    })
    .then(data => {
        sucCallBack(data.master);
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

function LoadingComponent() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gray-900"></div>
            <p className="text-lg text-gray-700 mt-4">占卜中...</p>
        </div>
    );
}

function IChing() {
    const [pageid, setPageid] = React.useState(0);
    const [hexagram, setHexagram] = React.useState("");
    const [round, setRound] = React.useState(1);
    const [question, setQuestion] = React.useState("");
    const [reply, setReply] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");
    const [questionNum, setQuestionNum] = React.useState(0);

    function goToNextPage(){
        setPageid(pageid+1);
    }

    function jumpToEndPage(){
        setPageid(10);
    }

    function jumpToTu2(){
        setPageid(9); // system to choose hexagram
    }

    function jumpToRes(){
        setHexagram(generateYinYang());
        setPageid(5); // system to choose hexagram
    }

    function jumpToStart(){
        setPageid(0);
    }

    function addHexagram(res){
        if (round==6){ // after 6 rounds
            setHexagram(hexagram+res);
            setPageid(5); // show the hexagram result
            return;
        }
        setRound(round+1);
        setHexagram(hexagram+res);
    }

    function firstQuestion(question){
        setQuestion(question);
        setPageid(7);
        divination_start(hexagram, question, successCallBack, errorCallBack);
    }

    function aftQuestion(question){
        setQuestionNum(questionNum+1);
        setQuestion(question);
        setPageid(7);
        divination_confusion(question, successCallBack, errorCallBack);
    }

    function successCallBack(aiReply){
        setReply(aiReply);
        setPageid(8);
    }

    function errorCallBack(msg){
        setErrorMsg(msg);
        setPageid(11);
    }


    return(
        <div id="root_div" className="flex flex-col justify-center items-center min-h-screen">
            {(pageid==0) && <Sayhello1 onClick={goToNextPage}/>}
            {(pageid==1) && <Sayhello2 onClick={goToNextPage}/>}
            {(pageid==2) && <Sayhello3 goToNextPage={goToNextPage} jumpToEndPage={jumpToEndPage}/>}
            {(pageid==3) && <Tutorial01 goToNextPage={goToNextPage} jumpToTu2={jumpToTu2}/>}
            {(pageid==4) && <TutorialUser addHexagram={addHexagram} round={round}/>}
            {(pageid==5) && <TutorialResult hexagram={hexagram} onClick={goToNextPage}/>}
            {(pageid==6) && <HexagramQuestion setQuestion={firstQuestion}/>}
            {(pageid==7) && <LoadingComponent />}
            {(pageid==8) && <QandA msg={reply} aftquestion={aftQuestion} questionNum={questionNum}/>}
            {(pageid==9) && <Tutorial02 jumpToRes={jumpToRes} jumpToEndPage={jumpToEndPage}/>}
            {(pageid==10) && <SayGoodbye jumpToStart={jumpToStart}/>}
            {(pageid==11) && <ErrorPage message={errorMsg}/>}
        </div>
        )
    }


const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<IChing />);