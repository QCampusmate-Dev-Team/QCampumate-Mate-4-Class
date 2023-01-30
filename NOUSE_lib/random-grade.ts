import randn_bm from './normal'
export default function rand_grade() {
  const rand = randn_bm();
  var gp;
  if(rand > -0.3 && rand < 0.3) {
    gp = 3;
  } else if (rand > -1.2 && rand <= -0.3 || rand >= 0.3 && rand < 1.2){
    gp = 4;
  } else if (rand > -2 && rand <= -1.2 || rand >= 1.2 && rand < 2) {
    gp = 2; 
  } else if (rand > -2.5 && rand <= -2 || rand >= 2 && rand < 2.5) {
    gp = 1;
  } else {
    gp = 0
  }
  return gp;
}