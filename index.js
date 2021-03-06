require('./style.css');
var gameBoard = new Array(100) //棋盘
var lastPlayer
var lastMoveCoor
var flag
var app = {
	init:function(){
		this.initGame()
		this.events()
	},
	initGame:function(){
		var table= '<table class="col-xs-12" id="realGameBoard">'+('<tr>'+'<td></td>'.repeat(10)+'</tr>').repeat(10)+'</table>'
		$('body').html(table)
	},

	fun:{
		userMove:function(e){
			// 获取鼠标点击点（设置误差范围）
			var x = e.clientX
			var y = e.clientY

			// 获取棋盘左上角格中心点坐标
			var element = $('#realGameBoard').find('tr').eq(0).children().eq(0)
			var offset = $('#realGameBoard').offset();
			var width = parseInt(element.css('width'))
			var oX = offset.left 
			var oY = offset.top 
			// 相对棋格坐标
			// 38/34为offset和clientX单位之间的转换
			var boardCoor = {x:(Math.ceil((x-oX)/width)),y:(Math.ceil((y-oY)/width))}
			
			// 棋盘坐标
			// console.log(e.offsetX)
			// 判断当前是否有棋子
			if(this.isOccupied(boardCoor)){
				return
			}
			this.makeMove(0,boardCoor)
			if(!flag){
				this.AIMove()
			}
		},

		AIMove:function(){
			// 判断对手最后一步的状态 攻 准备 守
			// 落子
			// 3连判断 
			var i = 5
			var endPoints
			do{
				endPoints = this.isN(lastMoveCoor,0,i)
				i--
			}while(endPoints===null && i>0)
			if(!this.makeMove(1,endPoints[0])){
				this.makeMove(1,endPoints[1])
			}
		},


		//裁判函数 若返回true则赢
		judge:function(){
			if(this.isN(lastMoveCoor,lastPlayer,5)!==null){
				$('#realGameBoard').off('click') //对局结束
				flag = true
				switch(lastPlayer){
					case 0:
						alert('你赢了')
						break
					case 1:
						alert('你输了')
						break
				}
			}else{
				flag = false
			}
		},


		// 连n判断 返回端点坐标
		// 通过四方向最大连来进行判断
		isN:function(coor,player,n){
			//四个方向的方向数组
			var directions=[{i:1,j:0},{i:1,j:1},{i:0,j:1},{i:-1,j:1}]
			var key = lastPlayer.toString().repeat(n)

			//遍历数组
			for(var a=0;a<directions.length;a++){
				var {i,j} = directions[a];	//ES6
				var {x,y} = lastMoveCoor
				//得到9连坐标数组
				var originalArray = Array.of({x:(x-4*i),y:(y-4*j)},
					{x:(x-3*i),y:(y-3*j)},
					{x:(x-2*i),y:(y-2*j)},
					{x:(x-i),y:(y-j)},
					{x:x,y:y},
					{x:(x+i),y:(y+j)},
					{x:(x+2*i),y:(y+2*j)},
					{x:(x+3*i),y:(y+3*j)},
					{x:(x+4*i),y:(y+4*j)}
				)
				switch(n){
					case 1:
						array=originalArray.slice(4,5)
						break
					case 2:
						array=originalArray.slice(3,6)
						break
					case 3:
						array=originalArray.slice(2,7)
						break
					case 4:
						array=originalArray.slice(1,8)
						break
					case 5:
						array=originalArray
						break
					default:
				}
				//获取相应点在棋盘上的值
				var result = array.map((value) => gameBoard[this.coor2Index(value)])
				//将数组中的undefined转化为2
				resultStr = result.map((x=2)=>x).join('')
				if(resultStr.includes(key)){
					var i = 0  //连通点起始标记
					while(!resultStr.startsWith(key,i)){
						i++
					}
					var j = i+n-1 //连通点末尾标记
					// 将i,j 译回棋盘坐标
					// 5-n为array在originArray中的起始位置
					return [originalArray[5-n+i-1],originalArray[5-n+j+1]]	//返回端点坐标数组
				}
			}
			return null

		},

		// 棋盘坐标化为数组坐标
		coor2Index:function(coor){
			var {x,y} = coor
			var index = (y-1)*10+x
			return index
		},

		// 判断当前位置是否有棋子
		isOccupied:function(coor){
			var index=this.coor2Index(coor)
			if(gameBoard[index]===undefined||coor.x<1||coor.y<1){
				return false
			}else{
				return true
			}
		},

		// 落子
		makeMove:function(player,coor){
			console.log(coor)
			if(coor.x===0||coor.x===11||coor.y===0||coor.y===11){ 
				return false //落子失败
			}
			var index=this.coor2Index(coor)
			if(this.isOccupied(coor)){
				return false	//落子失败
			}
			gameBoard[index]=(player==0)?0:1

			//最后一步记录信息更新
			lastPlayer = player
			lastMoveCoor = coor
			this.render(index,player)
			this.judge()
			return true	//落子成功

		},

		render:function(index,player){
			var chesspiece 
			if(player==0){
				chesspiece=$('<div class="black-chesspiece"></div>')
			}else{
				chesspiece=$('<div class="white-chesspiece"></div>')
			}
			$('#realGameBoard').find('td').eq(index-1).html(chesspiece)
		}


	},
	


	events:function(){
		var that = this
		$('#realGameBoard').on('click',function(e){
			that.fun.userMove(e)
		})
	}
}


app.init()


