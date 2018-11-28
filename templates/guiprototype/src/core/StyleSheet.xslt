<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:p="http://www.evolus.vn/Namespace/Pencil"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns="http://www.w3.org/1999/xhtml">
<xsl:output method="html"/>

    <xsl:template match="/">
        <html>
            <head>
				<title>
					<xsl:value-of select="/p:Document/p:Properties/p:Property[@name='fileName']/text()"/>
				</title>
				<link type="text/css" rel="stylesheet" href="Resources/style/style.min.css"/>
			</head>
			<body>
				<div id="loading">
					<span><!-- ico --></span>
					<p><!-- message --></p>
				</div>

				<div id="frame">
                    <div class="img-frame">
                        <!--
                        <img src="" width="" height="" usemap=""/>
                        <canvas></canvas>
                        -->
                    </div>
                </div>

				<div id="dial"><div>
					<h1></h1>
					<div><xsl:apply-templates select="/p:Document/p:Pages/p:Page" /></div>
				</div></div>

				<div id="notes"><div>
					<h1></h1>
					<div></div>
				</div></div>

				<div id="panel"><div>
					<h1></h1>
					<div class="buttons">
						<a class="notes"><span></span></a>
						<a class="back"><span></span></a>
						<a class="dial"><span></span></a>
						<a class="home"><span></span></a>
					</div>
				</div></div>

				<script type="text/javascript" src="Resources/js/jquery.min.js"></script>
				<script type="text/javascript" src="Resources/js/lang.min.js"></script>
				<script type="text/javascript" src="Resources/js/index.min.js"></script>
            </body>
        </html>
    </xsl:template>


    <xsl:template match="p:Page">
		<div class="page" _id="{p:Properties/p:Property[@name='fid']/text()}">
			<div class="img">
				<img src="{@rasterized}" _width="{p:Properties/p:Property[@name='width']/text()}"
						_height="{p:Properties/p:Property[@name='height']/text()}"/>
			</div>
			<h2><xsl:value-of select="p:Properties/p:Property[@name='name']/text()"/></h2>
			<div class="notes"><xsl:if test="p:Note/node()"><xsl:apply-templates select="p:Note/node()" mode="processing-notes"/></xsl:if></div>
		</div>

		<xsl:if test="p:Links/p:Link">
			<map name="map_{p:Properties/p:Property[@name='fid']/text()}">
				<xsl:apply-templates select="p:Links/p:Link" />
			</map>
		</xsl:if>
    </xsl:template>


    <xsl:template match="p:Link">
        <area shape="rect"
            coords="{@x},{@y},{@x+@w},{@y+@h}" href="#{@targetFid}" title="{@targetName}"/>
    </xsl:template>

    <xsl:template match="html:*" mode="processing-notes">
        <xsl:copy>
            <xsl:copy-of select="@*[local-name() != '_moz_dirty']"/>
            <xsl:apply-templates mode="processing-notes"/>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="html:a[@page-fid]" mode="processing-notes">
        <a href="#{@page-fid}" title="{@page-name}">
            <xsl:copy-of select="@class|@style"/>
            <xsl:apply-templates mode="processing-notes"/>
        </a>
    </xsl:template>
</xsl:stylesheet>
