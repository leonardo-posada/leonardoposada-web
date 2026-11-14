/** Kontigo Orb “Vidrio espectral” from kontigo-demo-rn, ported from SkSL to GLSL.
 * Material/math/colors unchanged; fragment coordinates use Skia’s top-down axis.
 * Output is premultiplied, as in the native shader. */
export const satinOrbFragment = `precision highp float;

uniform vec2 resolution;
uniform float time;
uniform float energy;
uniform float dark;
const float PI=3.14159265359;
float sq(float x){return x*x;}
float gauss(float x,float w){return exp(-sq(x/w));}
float hash3(vec3 p){p=fract(p*.3183099+vec3(.13,.31,.71));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise3(vec3 p){
 vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(mix(hash3(i),hash3(i+vec3(1,0,0)),f.x),mix(hash3(i+vec3(0,1,0)),hash3(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash3(i+vec3(0,0,1)),hash3(i+vec3(1,0,1)),f.x),mix(hash3(i+vec3(0,1,1)),hash3(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float field(vec3 q){return noise3(q)*.72+noise3(q*2.03+vec3(2.1,7.4,1.8))*.28;}

vec3 film(float t){
 vec3 blue=vec3(.012,.035,.74),cyan=vec3(.05,.86,.96),pearl=vec3(.67,.80,.91);
 vec3 c=mix(blue,cyan,smoothstep(.05,.56,t));
 c=mix(c,pearl,smoothstep(.58,.90,t));
 return c;
}
vec4 shade(vec2 xy){
 float radius=min(resolution.x,resolution.y)*.285;
 vec2 p=(xy-resolution*.5)/radius;
 float r=length(p),aa=1./radius;
 float edge=1.-smoothstep(1.-aa,1.+aa,r);
 if(r>1.+aa)return vec4(0.);
 float z=sqrt(max(.0001,1.-min(dot(p,p),.9999)));
 vec3 n=vec3(p,z);
 float phase=PI*time/4.16-1.6;
 vec3 axis=vec3(-.70710678*cos(phase),.70710678*cos(phase),sin(phase));
 float u=dot(n,axis)+.09*sin(n.x*3.+n.y*2.+time*(2.*PI/4.16))*z;
 // A physical ridge modifies the normals on either side of the fold.
 float width=.16 + energy*.025;
 float ridge=gauss(u,width);
 float groove=gauss(u-.22,.09);
 float slope=-2.*u/(width*width)*.14*ridge+2.*(u-.22)/(.09*.09)*.035*groove;
 vec3 tangent=axis-n*u;
 vec3 normal=normalize(n-slope*tangent);
 float facing=abs(normal.z);
 float fresnel=pow(1.-facing,.85);
 float shell=pow(1.-z,.72);
 float ripples=sin(p.x*2.4+p.y*1.6+time*(2.*PI/4.16))+.35*sin(p.y*4.-p.x*2.-time*(2.*PI/4.16));
 float thickness=.48+.22*ripples+.15*sin(atan(p.y,p.x)*3.+time*(2.*PI/4.16));
 float angle=atan(p.y,p.x);
 float tint=clamp(.03+.73*fresnel+.28*sin(angle*2.+time*(2.*PI/4.16))+.14*ripples,0.,1.);
 vec3 c=vec3(.0015,.004,.016);
 vec3 spectral=film(tint);
 float dispersion=sin(angle*5.+time*(2.*PI/4.16)+p.x*2.)*.5+.5;
 spectral=mix(spectral,vec3(.52,.12,.91),gauss(tint-.37,.11)*dispersion*.65);
 float magenta=gauss(tint-.18,.07)*(.35+.65*shell);
 spectral=mix(spectral,vec3(.49,.015,.95),magenta*.75);
 float rim=gauss(r-.993,.009+aa*.35);
 float studio=.25+.75*smoothstep(-.80,.80,p.x+p.y*.7);
 c+=spectral*(fresnel*.95+shell*.32)*studio;
 c+=vec3(.025,.015,.52)*fresnel*(1.-studio)*.5;
 c+=mix(vec3(.28,.63,.85),vec3(.66,.80,.90),.5+.5*sin(angle*2.+1.))*rim*.52;
 // Broad reflected studio strips reveal depth across the beveled fold.
 vec3 reflected=reflect(vec3(0.,0.,-1.),normal);
 float strip=gauss(reflected.y+reflected.x*.48-.2,.22);
 float foldLight=strip*ridge*(.32+.68*fresnel);
 c+=mix(vec3(.09,.72,.88),vec3(.72,.77,.95),.5+.5*sin(u*23.+thickness))*foldLight*.85;
 float satinFace=gauss(u+.025,.14)*(.48+.52*z);
 c+=mix(vec3(.25,.53,.69),vec3(.72,.73,.86),smoothstep(-.08,.06,u))*satinFace*.88;
 c+=vec3(.015,.025,.75)*gauss(r-.82,.13)*.30;
 float refracted=gauss(u-.27,.11)*gauss(r-.72,.30);
 c+=film(.30+.30*sin(angle*3.-time*(2.*PI/4.16)))*refracted*.20;
 // The far side of the fold remains visible through the glass, with less light.
 float backU=dot(vec3(p,-z),axis)-.06*sin(n.x*3.+n.y*2.+time*(2.*PI/4.16))*z;
 float backFace=gauss(backU,.13)*(.25+.75*z);
 float backLip=gauss(backU+.08,.014)*(.25+.75*z);
 float frontCover=1.-ridge*.8;
 c+=vec3(.10,.42,.62)*backFace*frontCover*.23;
 c+=vec3(.39,.70,.82)*backLip*frontCover*.28;
 float seam=gauss(u+.09,.016)*(.3+.7*z);
 c+=vec3(.39,.86,.95)*seam*.65;
 float trough=gauss(u-.13,.03)*(.4+.6*z);
 c*=1.-trough*.68;
 float underside=gauss(u-.23,.068)*(.3+.7*z);
 c+=vec3(.08,.33,.65)*underside*.48;
 // Gentle color dispersion across the bottom surface, with a dark optical center.
 float lower=smoothstep(-.3,.8,p.y);
 c+=vec3(.05,.28,.37)*shell*lower*.30;
 // Thin-film dispersion follows the reflected normal, so color fringes travel
 // over the curved glass instead of behaving like a flat rotating gradient.
 float optical=.5+.5*sin(thickness*3.+facing*3.+sin(reflected.x*2.+phase));
 float coating=clamp(fresnel*.65+ridge*.55+shell*.25,0.,1.);
 c+=vec3(.50,.015,.82)*gauss(optical-.18,.20)*coating*.44;
 c+=vec3(.025,.60,.30)*gauss(optical-.50,.18)*coating*.26;
 c+=vec3(.72,.58,.18)*gauss(optical-.78,.17)*coating*.23;
 float pearl=gauss(u+.015,.11)*(.5+.5*sin(thickness*4.+phase));
 c=mix(c,vec3(.61,.70,.80),pearl*.38);
 float turn=2.*PI*time/8.32;
 vec3 q=n;
 q.xz=vec2(cos(turn)*q.x-sin(turn)*q.z,sin(turn)*q.x+cos(turn)*q.z);
 float haze=field(q*2.0+vec3(2.4,1.1,4.7));
 float dispersionField=field(q*1.7+vec3(8.1,3.2,1.8));
 float transit=sq(cos(phase));
 vec3 marble=mix(vec3(.01,.025,.82),vec3(.05,.68,.79),smoothstep(.35,.65,haze));
 marble=mix(marble,vec3(.73,.62,.65),smoothstep(.57,.79,dispersionField));
 marble=mix(marble,vec3(.48,.02,.86),gauss(dispersionField-.30,.08));
 c=mix(c,marble,(.12+.45*haze)*transit*z*.60);
 // Preserve neutral pearl highlights while remapping the interference colors
 // to the same brand orange and splash fuchsia used by Kontigo's controls.
 float neutral=min(c.r,min(c.g,c.b));
 vec3 chroma=max(c-vec3(neutral),vec3(0.));
 float strength=max(chroma.r,max(chroma.g,chroma.b));
 float rose=clamp((chroma.g+chroma.r*.8)/max(strength,.0001),0.,1.);
 // A restrained rose accent on the fold and rim; orange remains dominant.
 float roseBlend=clamp(smoothstep(.12,.95,rose)+.055+.12*ridge+.04*shell,0.,1.);
 vec3 brand=mix(vec3(1.,.455,0.),vec3(.839,.286,.635),roseBlend);
 c=clamp(vec3(neutral)+brand*strength,0.,1.);
 // Light glass transmits the host background; the fold retains colored depth.
 float alpha=edge;
 if(dark<.5){
  float density=clamp(fresnel*.48+ridge*.70+shell*.35,0.,1.);
  float pigment=clamp(.24+strength*.80+ridge*.25,0.,.96);
  c=mix(vec3(1.,.94,.975),brand,pigment);
  c=mix(c,vec3(.63,.43,.56),trough*.35);
  c=mix(c,vec3(1.,.98,.98),clamp(neutral*.26+seam*.28+pearl*.10,0.,.6));
  alpha*=.25+.70*density;
 }
 c=clamp(c*(1.+energy*.22),0.,1.);
 return vec4(c*alpha,alpha);
}
void main(){gl_FragColor=shade(vec2(gl_FragCoord.x,resolution.y-gl_FragCoord.y));}
`;
