<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>URSTUDIO - Maintenance</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, sans-serif;
}

body{
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:linear-gradient(135deg,#0f051d,#1b0835,#2a0d52);
    color:white;
    text-align:center;
    overflow:hidden;
}

.container{
    max-width:700px;
    padding:40px;
}

.logo{
    font-size:48px;
    margin-bottom:20px;
}

h1{
    font-size:60px;
    margin-bottom:20px;
    background:linear-gradient(to right,#ffffff,#c084fc);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
}

p{
    font-size:20px;
    color:#d8b4fe;
    line-height:1.8;
    margin-bottom:30px;
}

.box{
    background:rgba(255,255,255,0.05);
    border:1px solid rgba(192,132,252,0.3);
    border-radius:20px;
    padding:25px;
    backdrop-filter:blur(10px);
}

ul{
    list-style:none;
    text-align:left;
}

ul li{
    margin:12px 0;
    font-size:18px;
}

ul li::before{
    content:"✓ ";
    color:#c084fc;
}

.footer{
    margin-top:30px;
    color:#a78bfa;
    font-size:16px;
}
</style>
</head>

<body>

<div class="container">

<div class="logo">🌙 URSTUDIO</div>

<h1>UNDER MAINTENANCE</h1>

<p>
We're upgrading our infrastructure and migrating our image hosting system
to improve performance, stability, and reading experience.
</p>

<div class="box">
<ul>
<li>Migrating to Cloudinary</li>
<li>Improving website speed</li>
<li>Optimizing image delivery</li>
<li>Fixing bugs and enhancing stability</li>
</ul>
</div>

<div class="footer">
We'll be back soon. Thank you for your patience ❤️
</div>

</div>

</body>
</html>
