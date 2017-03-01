init()

function init(){
	var gameBoard = new Array(100) //棋盘
	var realGameBoard = $('#realGameBoard')
	eventBind(realGameBoard)


	function eventBind(realGameBoard){
		realGameBoard.on('click',function(e){
			userMove(e)
			console.log('1')
		})
	}


	function userMove(e){
		// 获取鼠标点击点（设置误差范围）
		var x = e.clientX
		var y = e.clientY

		// 获取棋盘左上角格中心点坐标
		var element = realGameBoard.find('tr').eq(0).children().eq(0)
		var offset = element.offset();
		var width = element.width();
		var height = element.height();
		var centerX = offset.left + width / 2;
		var centerY = offset.top + height / 2;

		// 相对坐标
		var relCoor = {x:(x-centerX),y:(y-centerY)}
		console.log(relCoor)
		
		// 相对棋格坐标
		var relBoardCoor = {x:(Math.round(relCoor.x/width)),y:(Math.round(relCoor.y/height))}
		
		// 棋盘坐标
		var realBoardCoor ={x:(relBoardCoor.x+1),y:(relBoardCoor.y+1)}

		// 判断当前是否有棋子
		if(isOccupied(realBoardCoor)){
			return
		}
		console.log(realBoardCoor)
		makeMove(0,realBoardCoor)
		// judge() 
		// AIMove()
	}

	function AIMove(){
		// 判断对手最后一步的状态 攻 准备 守
		// 落子
		makeMove()
		judge() 
		userMove()

	}



	function judge(){


	}

	// 棋盘坐标化为数组坐标
	function coor2Index(coor){
		// console.log(coor)
		var x = coor.x
		var y = coor.y
		var index = (y-1)*10+x
		return index
	}

	// 判断当前位置是否有棋子
	function isOccupied(coor){
		var index=coor2Index(coor)
		console.log(gameBoard[index])
		return gameBoard[index]===undefined?false:true
	}

	// 落子
	function makeMove(player,coor){
		console.log(coor)
		var index=coor2Index(coor)
		gameBoard[index]=(player==0)?0:1
		render(realGameBoard,index,player)

	}

	function render(realGameBoard,index,player){
		var chesspiece = (player==0)?0:1
		realGameBoard.find('td').eq(index-1).append(chesspiece)
	}


}









// AI
// 守  黑方是否出现3连空 4连单堵  堵
// prep
// 攻  连3 连4 连5


// 数组 10x10 二维  实际为1维长度100
// 显示  table
// 每次下子 获取相应td 更新数据


// 数组的取值为undefined 0 1
// 0为黑方 1白方

// 3连的特征
// 4种情形
// 竖直  水平  左斜 右斜

// 竖直3连空
// 3种情形 
// 当前落子在上 若a.x+10 a.x+20均为0
// a.x-10 a.x+30为undefined
// 则a.x-10或a.x+30=1

