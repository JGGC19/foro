import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';

const URL = "https://devel.cdhidalgo.tecnm.mx/~irac/foro-rest";

interface user {
  id:number,
  username:string,
  role:string
}
interface Login{
  user:user,
  token:string
}

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  private user:user = {id:0, username:'', role:''};

  private userObs = new BehaviorSubject<user>(this.user);
  userObs$ =this.userObs.asObservable();

  constructor(private http: HttpClient) { }

  setUser(user:user){
    localStorage.setItem('id',user.id.toString());
    localStorage.setItem('username',user.username);
    localStorage.setItem('role',user.role);
    this.user = user;
    this.userObs.next(this.user);
  }

  getUser(){
    this.user.id = parseInt(localStorage.getItem('id') || '0');
    this.user.username = (localStorage.getItem('username') || '');
    this.user.role = (localStorage.getItem('role') || '');

    return this.user;
  }

  login(user:string, pass:string){
    return this.http.get<Login>(URL+'/login',
    {params:{username:user, password:pass}})
  }

  getTopics(url:string){
    if (url == '') url = URL+'/topics';
    const token = localStorage.getItem('token') || '';
    return this.http.get<any>(url,{headers:{Authorization:token}});
  }

  postTopics(post:any){
    const token = localStorage.getItem('token') || '';
    return this.http.post<any>(URL+'/topics',{title:post.title},
    {headers:{Authorization:token}});
  }

  putTopics(topic:any){
    const token = localStorage.getItem('token') || '';
    return this.http.put<any>(URL+'/topics/'+topic.id,{title:topic.title}, 
      {headers:{Authorization:token}});
  }

  deleteTopics(topic:any){
    const token = localStorage.getItem('token') || '';
    return this.http.delete<any>(URL+'/topics/'+topic.id, 
      {headers:{Authorization:token}});
  }
}
