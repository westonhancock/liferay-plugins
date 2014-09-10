<div id="myCarousel">
	<div class="carousel-item image1">
		<div class="carousel-content">
			<h1 class="header">${tagline_1.getData()}</h1>
		
			<p class="text">${synopsis_1.getData()}</p>
		
			<p class="destination">
				<a class="link" href="${link_1_url.getData()}">${link_1_name.getData()}</a>
			</p>
		</div>
	</div>
  
	<div class="carousel-item image2">
		<div class="carousel-content">
			<h1 class="header">${tagline_2.getData()}</h1>
			
			<p class="text">${synopsis_2.getData()}</p>
			
			<p class="destination">
				<a class="link" href="${link_2_url.getData()}">${link_2_name.getData()}</a>
			</p>
		</div>
	</div>
	
	<div class="carousel-item image3">
		<div class="carousel-content">
			<h1 class="header">${tagline_3.getData()}</h1>
		
			<p class="text">${synopsis_3.getData()}</p>
		
			<p class="destination">
				<a class="link" href="${link_3_url.getData()}">${link_3_name.getData()}</a>
			</p>
		</div>
	</div>
</div>

<script>
YUI().use(
  'aui-carousel',
  function(Y)
  {
    new Y.Carousel(
					  {
					    contentBox: '#myCarousel',
					    intervalTime: ${transition_delay.getData()}
					  }
    				).render();
  }
);
</script>

<style>
	.image1 {
		background-image: url(${Image_1.getData()});
	}

	.image2 {
		background-image: url(${Image_2.getData()});
	}

	.image3 {
		background-image: url(${Image_3.getData()});
	}
	
	#myCarousel {
		height: ${height.getData()}vw;
	    
	}
		.carousel-item {
			height: ${height.getData()}vw;

		}

</style>