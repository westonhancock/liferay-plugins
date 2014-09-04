<div class="product-content">
		<div class="product-header-icon">
			<i class="${product_icon.getData()} icon-3x product-icon"></i>
		</div>
 
 	<div class="product-body">
 		<div class="product-header">
 			<h1 class="product-title">${product_header.getData()}</h3>
 		</div>
 		
 		<div>
 			<p>
 			    ${product_synopsis.getData()}
 			</p>
 		</div>
 		
 		<div>
            <a href="${product_link.getFriendlyUrl()}">
                ${product_link_title.getData()}
            </a>
 		</div>
 	</div>
 </div>
</body>

<style type="text/css">
	body > div > i {
		color: #9d634c;
		line-height: 40px;
		display: block;
	}
</style>