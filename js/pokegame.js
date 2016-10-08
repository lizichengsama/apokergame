$(function(){
	// 红桃 H  黑桃 S  梅花  C  方块 D 
	// window.on('mousedown',false)
	var flag=true;
	
	function playPoke(){
		function makePoker(){
			var poke=[];
			var colors=['h','s','c','d']
			var biao={}
			while(poke.length!==52){
				var c=colors[Math.floor(Math.random()*4)]
				var n=Math.ceil(Math.random()*13)

				var v={
					color:c,
					number:n
				}

				if(!biao[c+n]){
					poke.push(v)
					biao[c+n]=true;
				}
			}
			return poke;
		}
			// var poke=makePoker()

		function setPoker(poker){
			// var dict={1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,11:11,12:12,13:13}

			var dict={1:'A',2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:'T',11:'J',12:'Q',13:'K'}


			var index=0;
			//思路和九九乘法表一样，两个参数定行列，top控制列高，left控制间距
			for(var j=0;j<7;j++){
				for(var k=0;k<j+1;k++){
					var poker=poke[index]
					index+=1;

					$('<div>').attr('id',j+'_'+k)
							  .attr('data-number',poker.number)
					  .appendTo('.scene')
					  .addClass('pai')
					  .css('background-image','url(./images/'+dict[poker.number]+poker.color+'.png)')
					  .delay(index*60)
					  .animate({
					  	top:j*50,
					  	left:k*140+(6-j)*70,
					  	opacity:1
					  })
				}
			}
			// 将剩余的牌放在一处，
			// for(index;index<30;index++){
			for(index;index<poke.length;index++){
				var poker=poke[index]
				$('<div>').appendTo('.scene')
						  .attr('data-number',poker.number)
						  .addClass('pai left')
					  	  .css('background-image','url(./images/'+dict[poker.number]+poker.color+'.png)')
					  	  .delay(index*60)
					  	  .animate({
					  	  	top:480,
					  	  	left:200,
					  	  	opacity:1
					  	  })
			}
		}
		// setPoker(poke)
		if(flag){
			var poke=makePoker()
			setPoker(poke)
			flag=false;
		}
	}

	$('.start-button').on('click',function(){
		$('.start-button').on('mousedown',false)
		// flag=true;
		playPoke();
	})
	
	$('.retry-button').on('click',function(){
		$('.retry-button').on('mousedown',false)
		flag=true;
		$('.pai').animate({
			opacity:0,
			top:0,
			right:0
		})
		playPoke()
	})



	// 结束按钮没反应
	// console.log($('.end-button'))
	$('.end-button').on('click',function(){
		$('.end-button').on('mousedown',false)
		flag=true;
		$('.pai').animate({
			opacity:0,
			top:0,
			right:0
		})
		})

	// function clearPoke(){
	// 	alert(9)
	// 	var quit=confirm("真的要结束吗?")
	// 	if(quit==true){
	// 		remove(setPoker(poke))
	// 	}
	// }




		// 必须知道
		// 同步和异步 地址和值 
		// 闭包函数  函数在定义的时候会记录自己可见范围内的所有变量(没有被js函数锁住的变量)
		// 只记录地址，不记录值
		// 记录的顺序从近到远
		// 所有的记录组成一个链条
		// 叫做函数的作用域链
		// 函数在调用时，会查看作用域链
		// 辅助自己正确的解释执行


		// JS中函数的这个特性导出闭包这个概念
		// 闭包通常用来构造一个更强大的函数
		// 或者用来获取一些中间状态的值

		// 左右换牌
		var moveRight=$('.scene .move-right')
		var zIndex=1;
		moveRight.on('click',function(){
			moveRight.on('mousedown',false)

			$('.left').last()
					  .css('z-index',zIndex++)
					  .animate({
					  left:650
					  })
					  // .removeClass('left').addClass('right')
					  .queue(function(){    //进队列，动画执行结束再进
					  	$(this).removeClass('left').addClass('right')
					  	.dequeue()			//出队，必须在内部出队
					  })
					  // 
		})

		var moveLeft=$('.scene .move-left')
		var number=0
		moveLeft.on('click',function(){
			if($('.left').length){
				return;
			}
			number+=1;
			if(number>3){
				return
			}
			// 查看function的arguments  再看this的指向
			// jquery中回掉函数中的this大部分情况下指向集合中的一个DOM元素或其他元素
			$('.right').each(function(i,v){
				$(this).delay(i*150)
					
					.animate({
						left:200
					})
					.css('z-index',0)
					  // .removeClass('right').addClass('left')

					.queue(function(){
					$(this).removeClass('right').addClass('left')
					.dequeue()
					})	
						
			})
			
		})





		var prev=null;
		// 只需要数字 不需要花色
		function getNumber(el){
			return parseInt($(el).attr('data-number'));
		}
		function covered(el){
			var x=parseInt($(el).attr('id').split('_')[0])
			var y=parseInt($(el).attr('id').split('_')[1])
			// 字符串转整数
			if($('#'+(x+1)+'_'+y).length||$('#'+(x+1)+'_'+(y+1)).length){
				return true;
			}else{
				return false;
			}
		}
		$('.scene').on('click','.pai',function(){
			$('.scene').on('mousedown',false)

			// $('this').stop()
			// alert(1)
			// 如果牌被压住  直接返回
			if($(this).attr('id')&&covered(this)){
				return;
			}
			
			var numbers=getNumber(this)
			// console.log(numbers)
			// 如果是13，直接消除
			if(numbers==13){
				$(this).animate({
				top:0,
				right:0,
				opacity:0
				})
				.queue(function(){
				$(this).remove().dequeue()
			})
				return
			}
			
		// 点击的是第一张时，存储数值
		// 加边框版
		// if(prev){
		// 	// alert(9)
		// 	if(getNumber(prev)+getNumber(this)==13){
		// 		// 两个都要变化  animate可以操作集合
		// 		prev.add(this).animate({
		// 			top:0,
		// 			right:0,
		// 			opacity:0
		// 		}).queue(function(){
		// 		$(this).remove().dequeue()
		// 	})
		// 	}else{
		// 		$(this).css('border','1px solid red')
		// 		prev.add(this).css('border','none')
				
		// 	}
		// 	prev=null;
		// }else{
		// 	prev=$(this)
		// 	$(this).css('border','1px solid red')
		// 	// 存储数值
		// 	// console.log(prev)
		// }
		
		// 加动画版
		if(!prev){
			prev=$(this)
			$(this).animate({
				top:'-=20'
			})
		}else{
			if(prev!=$(this)){
				if(getNumber(prev)+getNumber(this)==13){
					prev.add(this).animate({
						top:0
					}).queue(function(){
						$(this).detach().dequeue()
					})
					prev=null
				}else{
					$(this).animate({
						top:'-=20'
					}).animate({
						top:'+=20'
					})
					prev.delay(400).animate({
						top:'+=20'
					})
					prev=null;
				}
			}else{
				$(this).delay(0).animate({
					top:'+=20'
				})
			}
				

		}


			
		
		})

		















})