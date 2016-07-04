(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['about'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"about\">\r\n	<div class=\"container\">\r\n		<div class=\"logo-cell\">\r\n			<div class=\"logo\"></div>\r\n		</div>\r\n		<div class=\"content-cell\">\r\n			<div class=\"credits\">\r\n				<p>\r\n					<a target=\"_blank\" href=\"//github.com/GridSound/gridsound.github.io\">GridSound</a> and its\r\n					<a target=\"_blank\" href=\"//github.com/GridSound/webaudio-library\">WebAudio-library</a>\r\n					are two distinct open-source projects hosted on <i class=\"fa fa-github\"></i> GitHub and maintened by&nbsp;:\r\n				</p>\r\n				<a target=\"_blank\" class=\"contributor\" href=\"//github.com/Misty418\">\r\n					<img src=\"//avatars0.githubusercontent.com/u/3739218?v=3&s=50\"/>\r\n					<span class=\"name\"><b>Misty418</b> (Mélanie Ducani)</span>\r\n				</a><br/>\r\n				<a target=\"_blank\" class=\"contributor\" href=\"//github.com/Mr21\">\r\n					<img src=\"//avatars0.githubusercontent.com/u/850754?v=3&s=50\"/>\r\n					<span class=\"name\"><b>Mr21</b> (Thomas Tortorini)</span>\r\n				</a>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
templates['file'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<a class=\"sample\" draggable=\"true\">\r\n	<span class=\"name text-overflow\">\r\n		<i class=\"icon fa fa-fw\"></i>\r\n		<span>"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n	</span>\r\n</a>\r\n";
},"useData":true});
templates['files'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"files\">\r\n	<input type=\"file\"/>\r\n	<div class=\"extend cursor-ewResize\" data-mousemove-fn=\"files\"></div>\r\n	<nav class=\"filters\">\r\n		<a href=\"#\" class=\"used\">Used</a>\r\n		<a href=\"#\" class=\"loaded\">Loaded</a>\r\n		<a href=\"#\" class=\"unloaded\">Unloaded</a>\r\n	</nav>\r\n	<div class=\"filelist\"></div>\r\n	<div class=\"placeholder\">\r\n		<i class=\"fa fa-file-audio-o\"></i><br/>\r\n		<b>Drop audio files here</b>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
templates['grid'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"grid\">\r\n	<div class=\"emWrapper\">\r\n		<div class=\"header\">\r\n			<div class=\"timeline\">\r\n				<span class=\"timeArrow\"></span>\r\n			</div>\r\n		</div>\r\n		<div class=\"trackList\">\r\n			<div class=\"cols\">\r\n				<div class=\"colA trackNames\">\r\n					<div class=\"extend cursor-ewResize\" data-mousemove-fn=\"trackNames\"></div>\r\n				</div>\r\n				<div class=\"colB\">\r\n					<div class=\"trackLinesBg\"></div>\r\n					<div class=\"trackLines\">\r\n						<div class=\"timeCursor\"></div>\r\n					</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
templates['menu'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"menu\">\r\n	<a class=\"btn play fa fa-play\" title=\"Play/pause (Enter)\"></a>\r\n	<a class=\"btn stop fa fa-stop\" title=\"Stop (Backspace)\"></a>\r\n	<div class=\"bpm\" title=\"Beats per minute (Scroll to change)\">\r\n		<span class=\"text\">\r\n			<a class=\"a-bpm\">\r\n				<i class=\"fa\"></i>\r\n				<span class=\"int\"></span>\r\n				<span class=\"dec\"></span>\r\n			</a>\r\n			<div class=\"bpm-list\">\r\n				<a>80</a><a>90</a><a>100</a>\r\n				<a>110</a><a>120</a><a>130</a>\r\n				<a>140</a><a>150</a><a>160</a>\r\n			</div>\r\n			<span class=\"unit\">&nbsp;bpm</span>\r\n		</span>\r\n	</div>\r\n	<div class=\"tools\">\r\n		<a data-option=\"magnet\" class=\"btn fa fa-fw fa-magnet magnet\" title=\"Toggle magnetism (G)\"></a>\r\n		<a data-tool=\"select\" class=\"btn fa fa-fw fa-mouse-pointer\" title=\"Select (V)\"></a>\r\n		<a data-tool=\"paint\"  class=\"btn fa fa-fw fa-paint-brush\" title=\"Paint (B)\"></a>\r\n		<a data-tool=\"delete\" class=\"btn fa fa-fw fa-eraser\" title=\"Delete (D)\"></a>\r\n		<a data-tool=\"mute\"   class=\"btn fa fa-fw fa-volume-off\" title=\"Mute (M)\"></a>\r\n		<a data-tool=\"slip\"   class=\"btn fa fa-fw fa-exchange\" title=\"Slip (S)\"></a>\r\n		<a data-tool=\"cut\"    class=\"btn fa fa-fw fa-scissors\" title=\"Cut (C)\"></a>\r\n		<a data-tool=\"hand\"   class=\"btn fa fa-fw fa-hand-paper-o\" title=\"Hand (H)\"></a>\r\n		<a data-tool=\"zoom\"   class=\"btn fa fa-fw fa-search last\" title=\"Zoom (Z)\"></a>\r\n		<a data-edit=\"save\"   class=\"btn fa fa-fw fa-save save\" title=\"Save (Ctrl+S)\"></a>\r\n	</div>\r\n	<div class=\"separator\"></div>\r\n	<a href=\"#about\" class=\"about fa fa-question\" title=\"About\"></a>\r\n</div>\r\n";
},"useData":true});
templates['sample'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"sample\">\r\n	<div class=\"waveformWrapper\">\r\n		<canvas class=\"waveform\"></canvas>\r\n	</div>\r\n	<span class=\"name text-overflow\">"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n	<div class=\"crop start\"></div>\r\n	<div class=\"crop end\"></div>\r\n</div>\r\n";
},"useData":true});
templates['visual'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"visual\">\r\n	<canvas></canvas>\r\n	<div class=\"clock\">\r\n		<span class=\"min\"></span>\r\n		<span class=\"sec\"></span>\r\n		<span class=\"ms\"></span>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
templates['_app'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.about,depth0,{"name":"about","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.visual,depth0,{"name":"visual","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.menu,depth0,{"name":"menu","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.files,depth0,{"name":"files","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.grid,depth0,{"name":"grid","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
})();