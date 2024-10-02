<template>
	<div>
		<Head>
			<Title>NEI Almoxarifado | Login</Title>
			<Meta name="login" content="Página para realizar o login/cadastro"/>
		</Head>
	</div>
    <LoadersPageLoading :isLoading="loading" class="loader"/>
	<div class="d-flex justify-content-center bg-primary auth-container overflow-hidden">
		<div class="container-fluid login-container d-flex justify-content-center" :class="{'login-movement': switchState}" :style="{ 'border-radius': delayedSwitchState ? '0px 8px 8px 0px' : '8px 0px 0px 8px'}">
			<div :style="{height: switchState ? '100%' : '0%', width: switchState ? '100%' : '0%'}" class="bg-dark-emphasis position-absolute mobile-form"></div>
			<div class="login-content" :class="switchState ? 'leave-text' :'return-text'">
				<div class="header d-flex justify-content-center align-items-center">
					<p v-if="delayedSwitchState === false" class="texto mb-0 text-light">Entrar</p>
					<p v-else class="texto mb-0 text-light">Cadastrar</p>
				</div>
				<form v-if="delayedSwitchState === false" class="login-form mt-4 " @submit.prevent="submitLogin">
					<div class="form-group">
						<div class="input-container">
							<input 
								:class="{'border-dark-alert border-2': email && !isValidEmail(email)}"
								type="email" 
								id="email"  
								v-model="email" 
								required
								@focus="isEmailFocused = true"
								@blur="isEmailFocused = false"
								placeholder="">
						<label class="fw-bold rounded-1" :class="{'label-focus': isEmailFocused || email, 'text-light-alert': email && !isValidEmail(email)  }" for="email">{{email && !isValidEmail(email) ? 'Email inválido' : 'Email:'}}</label>
						</div>
					</div>
					<div class="form-group">
						<div class="input-container">
							<div class="d-flex align-items-center justify-content-end">
								<input 
									:class="{'border-dark-alert border-2': !password && email}"
									id="password" 
									:type="showPassword[0] ? 'text' : 'password'" 
									v-model="password" 
									required
									@focus="isPasswordFocused = true"
									@blur="isPasswordFocused = false"
									placeholder=""
									class="form-control pe-5"
								>
								<label class="fw-bold rounded-1" :class="{'label-focus': isPasswordFocused || password, 'text-light-alert': !password && email}" for="password">{{ !password && email ? 'Digite a senha' : 'Senha:'}}</label>
								<IconsOpenEye v-if="!showPassword[0]" @click="showPassword[0] = !showPassword[0]" class="position-absolute me-2 mb-2 text-light-emphasis eye" width="25" height="40"/>
								<IconsCloseEye v-if="showPassword[0]" @click="showPassword[0] = !showPassword[0]" class="position-absolute me-2 mb-2 text-light-emphasis eye" width="25" height="40"/>
							</div>
						</div>
					</div>
					<button 
						:class="!isValidEmail(email) || !password ? 'disabled-button' : ''" 
						:disabled="!isValidEmail(email) || !password"
						id="submitLogin" 
						class="fw-bold auth-btn mt-4 disabled" 
						type="submit"
						>
						Entrar
					</button>
				</form>
				<form v-else class="login-form mt-2" @submit.prevent="submitRegister">
					<div class="form-group">
						<div class="input-container">
							<input
								type="text" 
								id="username" 
								v-model="username"  
								required
								@focus="isUserFocused = true"
								@blur="isUserFocused = false"
								placeholder="">
								<label class="fw-bold rounded-1" :class="{'label-focus': isUserFocused || username}" for="username">Usuário:</label>
						</div>
					</div>
					<div class="form-group">
						<div class="input-container">
							<input 
								:class="{'border-dark-alert border-2': email && !isValidEmail(email)}"
								type="email" 
								id="email"  
								v-model="email" 
								required
								@focus="isEmailFocused = true"
								@blur="isEmailFocused = false"
								placeholder="">
						<label class="fw-bold rounded-1" :class="{'label-focus': isEmailFocused || email, 'text-light-alert': email && !isValidEmail(email)  }" for="email">{{email && !isValidEmail(email) ? 'Email inválido' : 'Email:'}}</label>
						</div>
					</div>
					<div class="form-group">
						<div class="input-container">
							<div class="d-flex align-items-center justify-content-end">
								<input 
									:class="{'border-dark-alert border-2': password && password.length < 6}"
									:type="showPassword[1] ? 'text' : 'password'" 
									id="password"  
									v-model="password" 
									required
									@focus="isPasswordFocused = true"
									@blur="isPasswordFocused = false"
									placeholder=""
									class="form-control pe-5"
								>
								<label class="fw-bold rounded-1" :class="{'label-focus': isPasswordFocused || password, 'text-light-alert': password && password.length < 6}" for="password">{{password && password.length < 6 ? 'Senha deve ser de 6 a mais caracteres' : 'Senha:'}}</label>
								<IconsOpenEye 
									v-if="!showPassword[1]" 
									@click="showPassword[1] = !showPassword[1]" 
									class="position-absolute me-2 mb-2 text-light-emphasis eye" 
									width="25" 
									height="40"
								/>
								<IconsCloseEye 
									v-if="showPassword[1]" 
									@click="showPassword[1] = !showPassword[1]"
									class="position-absolute me-2 mb-2 text-light-emphasis eye"
									width="25" height="40"
								/>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="input-container">
							<div class="d-flex align-items-center justify-content-end">
								<input 
									:class="{'border-dark-alert border-2': rePassword && rePassword !== password}"
									:type="showPassword[2] ? 'text' : 'password'" 
									id="rePassword"  
									v-model="rePassword" 
									required
									@focus="isRePasswordFocused = true"
									@blur="isRePasswordFocused = false"
									placeholder=""
									class="form-control pe-5"
								>
								<label class="fw-bold rounded-1" :class="{'label-focus': isRePasswordFocused || rePassword, 'text-dark-alert': rePassword && rePassword !== password}" for="rePassword">{{rePassword && rePassword !== password ? 'As senhas não conferem' : 'Confirmar senha:'}}</label>
								<IconsOpenEye v-if="!showPassword[2]" @click="showPassword[2] = !showPassword[2]" class="position-absolute me-2 mb-2 text-light-emphasis eye" width="25" height="40"/>
								<IconsCloseEye v-if="showPassword[2]" @click="showPassword[2] = !showPassword[2]" class="position-absolute me-2 mb-2 text-light-emphasis eye" width="25" height="40"/>
							</div>
						</div>
					</div>
					<button 
						:class="!isValidEmail(email) || rePassword !== password || password.length < 6 ? 'disabled-button' : ''" 
						:disabled="!isValidEmail(email) || rePassword !== password || password.length < 6" 
						id="submitRegister" 
						class="fw-bold auth-btn mt-4 disabled" 
						type="submit">
						Cadastrar
					</button>
				</form>
				<div class="info">
					<NuxtLink class="text-light text-decoration-underline" to="/recuperar-senha">Esqueceu sua senha?</NuxtLink>
					<br class="mb-2">
					<a class="text-light text-decoration-underline" href="mailto:almoxarifado957@gmail.com">Dúvidas? Clique aqui para contato.</a>
				</div>
			</div>
			<button :class="switchState ? 'leave-op' : 'return-op'"  class="mobile-btn btn btn-outline-warning border-bottom-0 text-warnign fw-bold position-absolute" @click="switchAuth">{{switchState ? 'Entrar' : 'Cadastrar'}}</button>
		</div>

		<div class="container bg-warning info-container d-flex align-items-center justify-content-center" :style="{'transform': switchState ? 'translateX(-106%)' : '', 'border-radius': delayedSwitchState ? '8px 0px 0px 8px' : '0px 8px 8px 0px'}">
			<div class="text-center mb-5">
				<h2 class="fw-bolder mb-3">{{ delayedSwitchState ?  'Vamos lá!' : 'Bem-vindo!'}}</h2>
				<div class=" text-center">				
					<p class="text-center fs-6 fw-bold">
						{{ delayedSwitchState ? 'Digite corretamento os dados' : 'Ainda não possui uma conta?' }}
						<br> 
						{{delayedSwitchState ? 'e verifique o endereço e-mail correto' : 'Cadastre-se:' }}
					</p>
					<button class="btn sign-up-btn auth-btn btn-light-alert text-light fw-bold" style="margin-left: 3px;" @click="switchAuth">
						{{delayedSwitchState ? 'Entrar' : 'Cadastrar'}}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'authentication'
});

import { onMounted, ref } from 'vue';
import { useUser } from '../stores/user.ts';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { postUser } from '../services/users/userPOST.ts';
import { navigateTo } from 'nuxt/app';
import { usePopupStore } from '../stores/popup.ts';

const userStore = useUser();
const popUpStore = usePopupStore();

const username = ref('');
const email = ref('');
const password = ref('');
const rePassword = ref('');

const showPassword = ref([false, false, false]);
const mobileFormToggle = ref(false);

const isEmailFocused = ref(false);
const isPasswordFocused = ref(false);
const isUserFocused = ref(false);
const isRePasswordFocused = ref(false);

const switchState = ref(false);
const delayedSwitchState = ref(false);

const switchAuth = async () => {
    switchState.value = !switchState.value;
    await new Promise(resolve => setTimeout(resolve, 370)); 
    delayedSwitchState.value = !delayedSwitchState.value;
};

const isValidEmail = (email) => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@nei\.ufrn\.br$/;
	return emailRegex.test(email);
};

const loading = ref(false);
const submitLogin = async () => {
	const authData = await userStore.fetchData(password.value, email.value);
	authData === 1 ? loading.value = true : 0;
};


const submitRegister = async () => {
	try{
		const res = await postUser(username.value, email.value, password.value)
		popUpStore.throwPopup('Cadastro feito com sucesso', '#0B3B69')
		switchAuth();
		return 1;
	}catch(err){	
		if(!err.response){
			popUpStore.throwPopup("Erro: Servidor fora do ar contate o suporte", "#B71C1C")
		}
		switch(err.response.status){
			case 400:
				popUpStore.throwPopup('Erro: O email escolhido já está em uso', '#B71C1C')
				break;
			case 422:
				popUpStore.throwPopup('Erro: A senha deve possuir de 6 a mais caracteres', '#B71C1C')
				break;
			default:
				popUpStore.throwPopup('Erro: Algum problema ocorreu, contate o suporte', '#B71C1C')	
		}
	}
}


const resetPassForm = () => {
  password.value = '';
  rePassword.value = '';
};

const initialLoading = ref(false);

onMounted(() => {
	initialLoading.value = true;
})

</script>

<style scoped>
.loader {
	top: 0px;
}
.container-fluid {
	padding: 0px;
}
.disabled-button {
  opacity: 75%;
  cursor: not-allowed !important;
  opacity: 40%;
}
.auth-container {  
	box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 1) !important;
	margin-top: 50px;	
	width: 650px;
	height: 450px;
	border-radius: 8px;
}
.inset-shadow{
	box-shadow: inset 0px 0px 80px 0px rgba(0, 0, 0, 0.3);
}
.login-container {
	width: 110%;
	flex-direction: column;
	transition: transform 0.7s ease-in-out;
	transform: translateX(0); 
}
.info-container {	
	width: 100%;
	flex-direction: column;
	transition: transform 0.7s ease-in-out;
	transform: translateX(0); 
}
.texto {
	margin: 40px 0px 20px;
	font-size: 32px;
	font-weight: bold;
}

.header {
	width: 100%;
	height: 65px;
	border-radius: 8px 0px 0px 0px;
	color: black;
	margin-top: 0px;
	padding: 0px;
}
.alert-text{
	z-index: 10000;
}
.eye{
	background-color: transparent;
	margin-bottom: 10px !important;
}
.login-form {
	margin-top: 1px;
	margin-left: 10px;
	margin-right: 10px;
	padding: 12px;

}
.login-movement{
	transform: translateX(94.52%);
}
.login-form .form-group {
	position: relative;
}

.login-form .input-container {
	position: relative;
}

.login-form label {
	position: absolute;
	left: 12px;
	color: rgb(0, 0, 0, 0.5);
	top: 40%;
	transform: translateY(-50%);
	transition: all 0.3s ease;
	pointer-events: none;
}

.login-form input[type="email"],
.login-form input[type="password"],
.login-form input[type="text"] {
	width: 100%;		
	padding: 8px;
	border: 1px solid #ccc;
	border-radius: 5px;
	margin-bottom: 10px;
}

.login-form .input-container:focus-within label {
	top: 0;
	font-size: 12px;
	background-color: #fff;
	padding: 0 5px;
}
.login-form input:not(:placeholder-shown) + label{
	top: 0;
	font-size: 12px;
	background-color: #fff; 
	padding: 0 5px;
}

.login-form button {
	width: 100%;
	padding: 11px;
	background-color: #31c939;
	color: #fff;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}
.sign-up-btn{
	padding: 11px;
	width: 100%;
}
.info {
	margin-top: 10px;
	margin-bottom: 10px;
	padding: 0px;
	text-align: center;
}

.info a {
	color: #007bff;
	text-decoration: none;
}

.info a:hover {
	text-decoration: underline;
}

.login-form button:hover {
	background-color: #71DD90;
}
.mobile-form{
	display: none;
}
.label-focus {
	top: 0;
	font-size: 12px;
	background-color: #fff; /* Ajuste conforme necessário */
	padding: 0 5px;
}
.mobile-btn{
	display: none;
}
@keyframes leaveDisplay{
	0% { display: none;}
	50% { display: none; }
	100% { display: block;}
}
@keyframes returnDisplay{
	0% { display: none;}
	50% { display: none; }
	100% { display: block;}
}
@keyframes leaveOpacity {
	0% { opacity: 100%; }		
	50% { opacity: 0%; }
	100% { opacity: 100%; }
}
@keyframes returnOpacity {
	0% { opacity: 100%; }		
	50% { opacity: 0%; }
	100% { opacity: 100%; }
}
@media screen and (max-width: 580px){
	.auth-container{
		width: 90%;
	}
	.login-content{
		margin-bottom: 70px;
	}
	.info-container{
		display: none !important;
	}
	.info-container p, h2{
		display: none !important;
	}
	.login-movement{
		transform: translateX(0px);
	}
	.mobile-form{
		border-radius: 8px;
		display: block;
		top: 0;
		right: 0;
		transition: height 1s ease-in-out, width 1s ease-in-out;
		z-index: -1;
	}
	#submitLogin{
		margin-bottom: 20px;
		margin-top: 22px !important;
	}
	.mobile-btn{
		border-radius: 10px 10px 0px 0px;
		display: block;
		bottom: 0; 
		left: 40%; 
		min-width: 100px !important;
	}
	.mobile-btn:focus{
		background-color: transparent;
		color: #FED51E;
	}
	@keyframes leaveText {
		0% { transform: translateX(0%); }		
		50% { transform: translateX(140%); }	
		100% { transform: translateX(0%); }
	}
	@keyframes returnText {
		0% { transform: translateX(0%); }		
		50% { transform: translateX(-140%); }
		100% { transform: translateX(0%); }
	}
	.leave-op{
		animation: leaveDisplay 2s;
	}
	.return-op{
		animation: returnDisplay 2s;
	}
	.leave-text{
		animation: leaveText 1.7s, leaveOpacity 1.9s;
	}
	.return-text{
		animation: returnText 1.7s, returnOpacity 1.9s;
	}
	.login-container{
		overflow: hidden !important;
	}
	.auth-btn{
		margin-top: 12px !important;
	}
	.login-form{
		margin-left: 10px;
		margin-right: 10px;
		padding-left: 2px;
		padding-right: 2px;
	}
	.texto{
		font-size: 37px !important;
	}
	.info{
		margin-top: 2px !important;
		font-size: 18px;
	}
}
@media screen and (max-width: 470px){
	.mobile-btn{
		left: 37%;
	}
}
@media screen and (max-width: 440px){
	.mobile-btn{
		left: 35%;
	}
}
</style>