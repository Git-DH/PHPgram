<!DOCTYPE html>
<html lang="en">
<?php include_once "application/views/template/head.php"; ?>
<body class="h-full container-center">
    <div>
        <h1>로그인</h1>
        <div class="err">
            <?php 
                if(isset($_GET["err"])) {
                    print "로그인을 할 수 없습니다.";
                }
            ?>
        </div>
        <form action="signin" method="post">
            <!-- post방식은 무조건 form태그가 있어야 하고 post로 들어온 정보로만 로그인 되도록 한다. -->
            <div><input type="email" name="email" placeholder="email" value="<?=getParam('email')?>" autofocus required></div>
            <div><input type="password" name="pw" placeholder="password" required></div>
            <div>
                <input type="submit" value="로그인">
            </div>
        </form>
        <div>
            <a href="signup">회원가입</a>
        </div>
    </div>
</body>
</html>