var gulp= require('gulp'),
svgSprite = require('gulp-svg-sprite'),
rename = require('gulp-rename'),
del = require('del'),
svg2png = require('gulp-svg2png');

var config = {
  mode: {
    css: {
      variables: {
        replaceSvgWithPng : function(){
          return function(sprite, render) {
            return render(sprite).split('.svg').join('.png');
          }
        }
      },
      sprite: 'sprite.svg',
      render: {
        css: {
          template: './gulp/templates/sprite.css'
        }
      }
    }
  }
}

gulp.task('beginClean', function(){
  return del(['./src/temp/sprite', './src/assets/images/sprites']);
});

gulp.task('createSprite',['beginClean'], function(){
  return gulp.src('./src/assets/images/icons/**/*.svg')
    .pipe(svgSprite(config))
    .pipe(gulp.dest('./src/temp/sprite/'));
});

gulp.task('createPngCopy', ['createSprite'], function(){
  return gulp.src('./src/temp/sprite/css/*.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('./src/temp/sprite/css'))
});

gulp.task('copySpriteGraphic',['createPngCopy'], function(){
  return gulp.src('./src/temp/sprite/css/**/*.{svg,png}')
    .pipe(gulp.dest('./src/assets/images/sprites'));
});

gulp.task('copySpriteCSS', ['createSprite'], function(){
  return gulp.src('./src/temp/sprite/css/*.css')
    .pipe(rename('_sprite.css'))
    .pipe(gulp.dest('./src/assets/styles/modules'));
});

gulp.task('endClean', ['copySpriteGraphic','copySpriteCSS'], function(){
  return del('./src/temp/sprite');
});



gulp.task('icons', ['beginClean','createSprite', 'createPngCopy', 'copySpriteGraphic', 'copySpriteCSS', 'endClean']);
