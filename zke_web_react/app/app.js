


function SayGoodbye({jumpToStart}){
    return(
        <div class="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p class="text-2xl font-bold text-center">
                时机成熟时 欢迎您再来寻求占卜指引
            </p>
            <buttom onClick={jumpToStart} class="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                结束占卜
            </buttom>
        </div>
    )
}

function QandA(){
    return(
        <div class="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p class="text-2xl font-bold text-center">
                段乾坤所述
            </p>
            <p class="text-xl font-bold text-center">
                阿八八八 西巴下班 后数据收集数据
            </p>
            <textarea value = "卜问"></textarea>
            <buttom class="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                继续请示
            </buttom>
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
        <div class="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p class="text-2xl font-bold text-center">
                接下来 请输入你的困惑和疑问
            </p>
            <input class="rounded-md border-gray-500" type="text" placeholder="卜问" value={questionInput} onChange={onChange}/>
            <buttom onClick={submitQuestion} class="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                求解卦象
            </buttom>
        </div>
    )
}


function TutorialResult({hexagram, onClick}){
    let hexagramTitle = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
    return(
        <div class="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p class="text-2xl font-bold text-center">
                卦象
            </p>
            {Array.from(hexagram).map((char, index)=>{
                return(
                    <p class="text-xl font-bold text-center">
                        {hexagramTitle[index]} {char}
                    </p>
                )
            })}
            <buttom onClick={onClick} class="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                输入卜问
            </buttom>
        </div>
    )
}

function TutorialUser({round, addHexagram}){

    return(
        <div class="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p class="text-2xl font-bold text-center">
                第{round}次投掷
            </p>
            <p class="text-xl font-bold text-center">
                心中默念自己的困惑 投出三枚硬币 勾选正面朝上的硬币
            </p>
            <div class="flex flex-row gap-16 justify-center">
                <buttom class="text-slate-800 text-xl font-bold text-center hover:text-blue-600"
                    onClick={()=>addHexagram("阴")}>
                    没有
                </buttom>
                <buttom class="text-slate-800 text-xl font-bold text-center hover:text-blue-600"
                    onClick={()=>addHexagram("阳")}>
                    一个
                </buttom>
                <buttom class="text-slate-800 text-xl font-bold text-center hover:text-blue-600"
                    onClick={()=>addHexagram("阴")}>
                    两个
                </buttom>
                <buttom class="text-slate-800 text-xl font-bold text-center hover:text-blue-600"
                    onClick={()=>addHexagram("阳")}>
                    三个
                </buttom>
            </div>
        </div>
    )
}

function Tutorial02({jumpToEndPage, jumpToRes}){
    return(
        <div class="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p class="text-2xl font-bold text-center">
                我将代你生成卦象 你愿意由我代你投掷吗？
            </p>
            <div class="flex flex-row gap-24 justify-center">
                <buttom onClick={jumpToRes} class="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    愿意
                </buttom>
                <buttom onClick={jumpToEndPage} class="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    不愿意
                </buttom>
            </div>
        </div>
    )
}

function Tutorial01({goToNextPage, jumpToTu2}){
    return(
        <div class="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p class="text-2xl font-bold text-center">
                你身旁有三枚相同的硬币吗？
            </p>
            <div class="flex flex-row gap-24 justify-center">
                <buttom onClick={goToNextPage} class="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    我有
                </buttom>
                <buttom onClick={jumpToTu2} class="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    我没有
                </buttom>
            </div>
        </div>
    )
}

function Sayhello3({goToNextPage, jumpToEndPage}){
    return(
        <div class="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl">
            <p class="text-2xl font-bold text-center">
                你准备好了吗?
            </p>
            <div class="flex flex-row gap-8 justify-center">
                <buttom onClick={goToNextPage} class="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    开始占卜
                </buttom>
                <buttom onClick={jumpToEndPage} class="text-slate-800 text-xl font-bold text-center hover:text-blue-600">
                    稍后继续
                </buttom>
            </div>
        </div>
    )
}

function Sayhello2({onClick}){
    return(
        <buttom onClick={onClick} class="flex flex-col gap-2 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl hover:shadow-2xl">
            <p class="text-2xl font-bold text-center">
                只有遇到真正的困惑
            </p>
            <p class="text-2xl font-bold text-center">
                才能得到相应的答案
            </p>
        </buttom>
    )
}

function Sayhello1({onClick}){
    return(
        <buttom onClick={onClick} class="flex flex-col gap-8 justify-center items-center bg-neutral-50 py-12 px-12 rounded-lg shadow-xl hover:shadow-2xl">
            <p class="text-3xl font-bold text-center">
                段乾坤 周易八卦 占卜屋
            </p>
        </buttom>
    )
}

function IChing() {
    const [pageid, setPageid] = React.useState(0);
    const [hexagram, setHexagram] = React.useState("");
    const [round, setRound] = React.useState(1);
    const [question, setQuestion] = React.useState("");

    function submitQuestion(){
    }

    function goToNextPage(){
        setPageid(pageid+1);
    }

    function jumpToEndPage(){
        setPageid(9);
    }

    function jumpToTu2(){
        setPageid(8); // system to choose hexagram
    }

    function jumpToRes(){
        setPageid(5); // system to choose hexagram
    }

    function jumpToStart(){
        setPageid(0);
    }

    function addHexagram(res){
        if (round==6){ // after 6 rounds
            setPageid(5); // show the hexagram result
            return;
        }
        setRound(round+1);
        setHexagram(hexagram+res);
    }

    function firstQuestion(question){
        setQuestion(question);
        setPageid(pageid+1);
        alert(question);
    }


    return(
        <div id="root_div" class="flex flex-col justify-center items-center min-h-screen">
            {(pageid==0) && <Sayhello1 onClick={goToNextPage}/>}
            {(pageid==1) && <Sayhello2 onClick={goToNextPage}/>}
            {(pageid==2) && <Sayhello3 goToNextPage={goToNextPage} jumpToEndPage={jumpToEndPage}/>}
            {(pageid==3) && <Tutorial01 goToNextPage={goToNextPage} jumpToTu2={jumpToTu2}/>}
            {(pageid==4) && <TutorialUser addHexagram={addHexagram} round={round}/>}
            {(pageid==5) && <TutorialResult hexagram={hexagram} onClick={goToNextPage}/>}
            {(pageid==6) && <HexagramQuestion setQuestion={firstQuestion}/>}
            {(pageid==7) && <QandA />}
            {(pageid==8) && <Tutorial02 jumpToRes={jumpToRes} jumpToEndPage={jumpToEndPage}/>}
            {(pageid==9) && <SayGoodbye jumpToStart={jumpToStart}/>}
        </div>
        )
    }


const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<IChing />);