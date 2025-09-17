// ==========================================================================
// MODERN DEVELOPER PORTFOLIO - JAVASCRIPT MODERNIZADO
// ==========================================================================

// Configurações e constantes
const CONFIG = {
  typingSpeed: 100,
  typingDelay: 2000,
  particleCount: 50,
  skillAnimationDelay: 500,
  smoothScrollOffset: 80,
};

// Textos para animação de digitação
const TYPING_TEXTS = [
  "Desenvolvedor Frontend",
  "Criador de Interfaces",
  "Entusiasta React",
  "UI/UX Designer",
  "Desenvolvedor JavaScript",
];

// Estado da aplicação
const AppState = {
  currentTypingIndex: 0,
  isTyping: false,
  particles: [],
  isScrolling: false,
};

// ==========================================================================
// UTILIDADES
// ==========================================================================

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Função para animação suave de números
const animateNumber = (element, start, end, duration) => {
  const startTime = performance.now();
  const step = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    element.textContent = current + "+";
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
};

// ==========================================================================
// CURSOR PERSONALIZADO
// ==========================================================================

// class CustomCursor {
//   constructor() {
//     this.cursor = document.querySelector(".cursor");
//     this.follower = document.querySelector(".cursor-follower");
//     this.mouseX = 0;
//     this.mouseY = 0;
//     this.cursorX = 0;
//     this.cursorY = 0;
//     this.followerX = 0;
//     this.followerY = 0;

//     this.init();
//   }

//   init() {
//     if (!this.cursor || !this.follower) return;

//     // Event listeners
//     document.addEventListener("mousemove", (e) => {
//       this.mouseX = e.clientX;
//       this.mouseY = e.clientY;
//     });

//     // Interações especiais
//     document
//       .querySelectorAll("a, button, .btn, .project-card, .skill-item")
//       .forEach((el) => {
//         el.addEventListener("mouseenter", () => this.growCursor());
//         el.addEventListener("mouseleave", () => this.shrinkCursor());
//       });

//     this.animate();
//   }

//   animate() {
//     // Cursor principal (rápido)
//     this.cursorX += (this.mouseX - this.cursorX) * 0.9;
//     this.cursorY += (this.mouseY - this.cursorY) * 0.9;

//     // Cursor follower (lento)
//     this.followerX += (this.mouseX - this.followerX) * 0.1;
//     this.followerY += (this.mouseY - this.followerY) * 0.1;

//     if (this.cursor && this.follower) {
//       this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;
//       this.follower.style.transform = `translate(${this.followerX}px, ${this.followerY}px)`;
//     }

//     requestAnimationFrame(() => this.animate());
//   }

//   growCursor() {
//     if (this.cursor && this.follower) {
//       this.cursor.style.transform += " scale(1.5)";
//       this.follower.style.transform += " scale(1.2)";
//     }
//   }

//   shrinkCursor() {
//     if (this.cursor && this.follower) {
//       this.cursor.style.transform = this.cursor.style.transform.replace(
//         " scale(1.5)",
//         ""
//       );
//       this.follower.style.transform = this.follower.style.transform.replace(
//         " scale(1.2)",
//         ""
//       );
//     }
//   }
// }

// ==========================================================================
// SISTEMA DE PARTÍCULAS
// ==========================================================================

class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("particles-canvas");
    this.ctx = null;
    this.particles = [];
    this.mouse = { x: 0, y: 0 };

    this.init();
  }

  init() {
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.resize();
    this.createParticles();
    this.animate();

    // Event listeners
    window.addEventListener("resize", () => this.resize());
    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animate() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, index) => {
      // Atualizar posição
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Interação com mouse
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx -= dx * force * 0.01;
        particle.vy -= dy * force * 0.01;
      }

      // Limites da tela
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Desenhar partícula
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 216, 255, ${particle.opacity})`;
      this.ctx.fill();

      // Conexões entre partículas próximas
      for (let j = index + 1; j < this.particles.length; j++) {
        const otherParticle = this.particles[j];
        const dx2 = particle.x - otherParticle.x;
        const dy2 = particle.y - otherParticle.y;
        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (distance2 < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = `rgba(0, 216, 255, ${
            0.3 * (1 - distance2 / 100)
          })`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================================================
// ANIMAÇÃO DE DIGITAÇÃO
// ==========================================================================

class TypingAnimation {
  constructor(element) {
    this.element = element;
    this.currentIndex = 0;
    this.currentText = "";
    this.isDeleting = false;
    this.typeSpeed = 100;
    this.deleteSpeed = 50;
    this.pauseTime = 2000;

    this.init();
  }

  init() {
    if (!this.element) return;
    this.type();
  }

  type() {
    const fullText = TYPING_TEXTS[this.currentIndex];

    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }

    this.element.textContent = this.currentText;

    let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.currentText === fullText) {
      speed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === "") {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % TYPING_TEXTS.length;
      speed = 500;
    }

    setTimeout(() => this.type(), speed);
  }
}

// ==========================================================================
// NAVEGAÇÃO E SCROLL
// ==========================================================================

class Navigation {
  constructor() {
    this.navbar = document.querySelector(".navbar");
    this.navToggle = document.getElementById("nav-toggle");
    this.navLinks = document.getElementById("nav-links");
    this.navItems = document.querySelectorAll(".nav-links a");
    this.sections = document.querySelectorAll("section[id]");

    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupScrollSpy();
    this.setupNavbarScroll();
  }

  setupMobileMenu() {
    if (!this.navToggle || !this.navLinks) return;

    this.navToggle.addEventListener("click", () => {
      this.navToggle.classList.toggle("active");
      this.navLinks.classList.toggle("active");
    });

    // Fechar menu ao clicar em um link
    this.navItems.forEach((link) => {
      link.addEventListener("click", () => {
        this.navToggle.classList.remove("active");
        this.navLinks.classList.remove("active");
      });
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");

        if (href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);

          if (target) {
            const offsetTop = target.offsetTop - CONFIG.smoothScrollOffset;

            window.scrollTo({
              top: offsetTop,
              behavior: "smooth",
            });
          }
        }
      });
    });
  }

  setupScrollSpy() {
    const scrollSpy = throttle(() => {
      const scrollY = window.pageYOffset;

      this.sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          this.navItems.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active");
            }
          });
        }
      });
    }, 100);

    window.addEventListener("scroll", scrollSpy);
  }

  setupNavbarScroll() {
    if (!this.navbar) return;

    const handleScroll = throttle(() => {
      if (window.scrollY > 100) {
        this.navbar.classList.add("scrolled");
      } else {
        this.navbar.classList.remove("scrolled");
      }
    }, 100);

    window.addEventListener("scroll", handleScroll);
  }
}

// ==========================================================================
// SISTEMA DE FILTROS DE PROJETOS
// ==========================================================================

class ProjectFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll(".filter-btn");
    this.projectCards = document.querySelectorAll(".project-card");

    this.init();
  }

  init() {
    if (!this.filterButtons.length || !this.projectCards.length) return;

    this.filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleFilter(button);
      });
    });
  }

  handleFilter(activeButton) {
    const filter = activeButton.getAttribute("data-filter");

    // Atualizar botões ativos
    this.filterButtons.forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");

    // Filtrar projetos
    this.projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        card.classList.remove("hide");
      } else {
        card.classList.add("hide");
      }
    });

    // Animação escalonada para cards visíveis
    setTimeout(() => {
      const visibleCards = document.querySelectorAll(
        ".project-card:not(.hide)"
      );
      visibleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
      });
    }, 100);
  }
}

// ==========================================================================
// FORMULÁRIO DE CONTATO
// ==========================================================================

class ContactForm {
  constructor() {
    this.form = document.getElementById("formContato");
    this.statusDiv = document.getElementById("mensagem-status");
    this.inputs = this.form?.querySelectorAll("input, textarea");

    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.setupInputValidation();
  }

  setupInputValidation() {
    this.inputs?.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = "";

    // Validação por tipo de campo
    switch (field.type) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          message = "E-mail inválido";
        }
        break;
      case "text":
        if (value.length < 2) {
          isValid = false;
          message = "Muito curto";
        }
        break;
      default:
        if (field.tagName.toLowerCase() === "textarea" && value.length < 10) {
          isValid = false;
          message = "Mensagem muito curta";
        }
    }

    // Aplicar estilos de validação
    if (!isValid) {
      field.style.borderColor = "#e74c3c";
      this.showFieldError(field, message);
    } else {
      field.style.borderColor = "#2ecc71";
      this.clearFieldError(field);
    }

    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);

    const errorEl = document.createElement("span");
    errorEl.className = "field-error";
    errorEl.textContent = message;
    errorEl.style.cssText = `
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 5px;
      display: block;
    `;

    field.parentNode.appendChild(errorEl);
  }

  clearFieldError(field) {
    const errorEl = field.parentNode.querySelector(".field-error");
    if (errorEl) {
      errorEl.remove();
    }
    field.style.borderColor = "";
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Obter dados do formulário
    const nome = document.getElementById("nome")?.value?.trim();
    const email = document.getElementById("email")?.value?.trim();
    const assunto = document.getElementById("assunto")?.value?.trim();
    const mensagem = document.getElementById("mensagem")?.value?.trim();

    const data = { nome, email, assunto, mensagem };

    // Validar todos os campos
    let isFormValid = true;
    this.inputs?.forEach((input) => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showMessage("Por favor, corrija os erros no formulário.", "erro");
      return;
    }

    // Mostrar loading
    this.showMessage("Enviando mensagem...", "enviando");

    try {
      // Tentar múltiplas URLs do servidor
      const serverUrls = [
        "https://nodemailer-backend-iweb.onrender.com/enviar-email",
        "https://portfolio-api-lenin.herokuapp.com/enviar-email", // URL de backup se necessário
      ];

      let response = null;
      let lastError = null;

      for (const url of serverUrls) {
        try {
          console.log(`Tentando enviar para: ${url}`);

          response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(data),
            mode: "cors",
            credentials: "omit",
          });

          if (response.ok) {
            break; // Se deu certo, sair do loop
          } else {
            throw new Error(`Servidor retornou status ${response.status}`);
          }
        } catch (error) {
          console.warn(`Falha ao conectar com ${url}:`, error);
          lastError = error;
          continue; // Tentar próxima URL
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error("Todos os servidores falharam");
      }

      const result = await response.json();

      if (result.sucesso) {
        this.showMessage("Mensagem enviada com sucesso! ✅", "sucesso");
        this.form.reset();
        this.clearAllFieldErrors();

        // Analytics - rastrear envio bem-sucedido
        console.log("📧 Formulário enviado com sucesso");
      } else {
        throw new Error(result.mensagem || "Erro desconhecido do servidor");
      }
    } catch (error) {
      console.error("❌ Erro ao enviar formulário:", error);

      // Diferentes mensagens baseadas no tipo de erro
      let errorMessage = "Erro ao enviar mensagem. ";

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("network")
      ) {
        errorMessage +=
          "Verifique sua conexão com a internet e tente novamente.";
      } else if (error.message.includes("CORS")) {
        errorMessage +=
          "Problema de configuração do servidor. Tente novamente em alguns minutos.";
      } else if (error.message.includes("400")) {
        errorMessage +=
          "Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.";
      } else if (error.message.includes("500")) {
        errorMessage += "Erro interno do servidor. Tente novamente mais tarde.";
      } else {
        errorMessage += "Tente novamente em alguns minutos.";
      }

      this.showMessage(errorMessage + " ❌", "erro");

      // Fallback - mostrar informações alternativas de contato
      setTimeout(() => {
        this.showFallbackContact();
      }, 3000);
    }

    // Esconder mensagem após 8 segundos
    setTimeout(() => {
      if (this.statusDiv && !this.statusDiv.classList.contains("escondido")) {
        this.statusDiv.classList.add("escondido");
      }
    }, 8000);
  }

  showFallbackContact() {
    const fallbackMsg = `
      <div style="margin-top: 15px; padding: 15px; background: rgba(0, 216, 255, 0.1); border-radius: 8px; border: 1px solid rgba(0, 216, 255, 0.3);">
        <p style="margin: 0; color: var(--primary-color); font-weight: 600;">📱 Contato Alternativo:</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">
          WhatsApp: <a href="https://wa.me/5551989134037" target="_blank" style="color: var(--primary-color);">+55 51 9 8913-4037</a><br>
          Email: <a href="mailto:lenin.fontella@gmail.com" style="color: var(--primary-color);">lenin.fontella@gmail.com</a>
        </p>
      </div>
    `;

    if (this.statusDiv) {
      this.statusDiv.innerHTML = fallbackMsg;
      this.statusDiv.className = "status-mensagem";
      this.statusDiv.classList.remove("escondido");
    }
  }

  showMessage(text, type) {
    if (!this.statusDiv) return;

    this.statusDiv.textContent = text;
    this.statusDiv.className = `status-mensagem ${type}`;
    this.statusDiv.classList.remove("escondido");
  }

  clearAllFieldErrors() {
    this.inputs?.forEach((input) => {
      this.clearFieldError(input);
      input.style.borderColor = "";
    });
  }
}

// ==========================================================================
// ANIMAÇÕES DE SCROLL
// ==========================================================================

class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.observeElements();
    this.animateSkillBars();
    this.animateCounters();
  }

  observeElements() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observar elementos para animação
    document
      .querySelectorAll(".skill-bar, .project-card, .stat-item")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  animateSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skillProgress = entry.target;
            const width = skillProgress.style.getPropertyValue("--width");

            setTimeout(() => {
              skillProgress.style.width = width;
            }, CONFIG.skillAnimationDelay);

            observer.unobserve(skillProgress);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillBars.forEach((bar) => observer.observe(bar));
  }

  animateCounters() {
    const counters = document.querySelectorAll(".stat-number");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.textContent);

            animateNumber(counter, 0, target, 2000);
            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }
}

// ==========================================================================
// LOADER
// ==========================================================================

class PageLoader {
  constructor() {
    this.loader = document.getElementById("loader");
    this.init();
  }

  init() {
    if (!this.loader) return;

    // Simular carregamento
    const loadingTime = Math.random() * 1000 + 1500; // 1.5s - 2.5s

    setTimeout(() => {
      this.hideLoader();
    }, loadingTime);
  }

  hideLoader() {
    if (this.loader) {
      this.loader.classList.add("escondido");

      // Remover do DOM após animação
      setTimeout(() => {
        if (this.loader.parentNode) {
          this.loader.parentNode.removeChild(this.loader);
        }
      }, 500);
    }
  }
}

// ==========================================================================
// TEMA ESCURO/CLARO
// ==========================================================================

class ThemeToggle {
  constructor() {
    this.toggle = document.getElementById("theme-toggle");
    this.currentTheme = localStorage.getItem("theme") || "dark";

    this.init();
  }

  init() {
    if (!this.toggle) return;

    this.applyTheme(this.currentTheme);

    this.toggle.addEventListener("click", () => {
      this.currentTheme = this.currentTheme === "dark" ? "light" : "dark";
      this.applyTheme(this.currentTheme);
      localStorage.setItem("theme", this.currentTheme);
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    const icon = this.toggle?.querySelector("i");
    if (icon) {
      icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  }
}

// ==========================================================================
// PERFORMANCE E OTIMIZAÇÕES
// ==========================================================================

class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.preloadCriticalResources();
    this.optimizeAnimations();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  preloadCriticalResources() {
    const criticalImages = [
      "https://i.ibb.co/5hMN2GMG/Chat-GPT-Image-3-de-ago-de-2025-21-35-54.png",
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  }

  optimizeAnimations() {
    // Pausar animações quando não visível
    document.addEventListener("visibilitychange", () => {
      const particles = document.querySelector(".particles-container");
      if (particles) {
        particles.style.animationPlayState = document.hidden
          ? "paused"
          : "running";
      }
    });

    // Reduzir animações em dispositivos com pouco desempenho
    if (navigator.hardwareConcurrency < 4) {
      document.body.classList.add("reduced-motion");
    }
  }
}

// ==========================================================================
// ANALYTICS E TRACKING
// ==========================================================================

class Analytics {
  constructor() {
    this.init();
  }

  init() {
    this.trackPageView();
    this.trackInteractions();
    this.trackPerformance();
  }

  trackPageView() {
    // Implementar analytics (Google Analytics, etc.)
    console.log("Page viewed:", window.location.pathname);
  }

  trackInteractions() {
    // Rastrear cliques em botões importantes
    document
      .querySelectorAll(".btn-primary, .project-link, .social-link")
      .forEach((element) => {
        element.addEventListener("click", (e) => {
          const action = e.target.closest("a") ? "link_click" : "button_click";
          const label = e.target.textContent.trim() || e.target.className;

          console.log("Interaction:", { action, label, url: e.target.href });

          // Aqui você integraria com seu sistema de analytics
        });
      });
  }

  trackPerformance() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;

        console.log("Page load time:", loadTime + "ms");

        // Enviar dados para analytics
      }, 0);
    });
  }
}

// ==========================================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================================================

class App {
  constructor() {
    this.components = new Map();
    this.init();
  }

  init() {
    // Verificar se DOM está carregado
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initializeComponents()
      );
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Componentes principais
      this.components.set("loader", new PageLoader());
      this.components.set("cursor", new CustomCursor());
      this.components.set("particles", new ParticleSystem());
      this.components.set("navigation", new Navigation());
      this.components.set("projectFilter", new ProjectFilter());
      this.components.set("contactForm", new ContactForm());
      this.components.set("scrollAnimations", new ScrollAnimations());
      this.components.set("themeToggle", new ThemeToggle());
      this.components.set("performanceOptimizer", new PerformanceOptimizer());
      this.components.set("analytics", new Analytics());

      // Inicializar animação de digitação
      const typingElement = document.getElementById("typing-text");
      if (typingElement) {
        this.components.set(
          "typingAnimation",
          new TypingAnimation(typingElement)
        );
      }

      console.log("🚀 Portfolio carregado com sucesso!");
    } catch (error) {
      console.error("❌ Erro na inicialização:", error);
    }
  }

  // Método para obter componente específico
  getComponent(name) {
    return this.components.get(name);
  }

  // Método para destruir componentes (útil para cleanup)
  destroy() {
    this.components.clear();
  }
}

// ==========================================================================
// INICIALIZAÇÃO GLOBAL
// ==========================================================================

// Inicializar aplicação
const portfolio = new App();

// Expor globalmente para debug (apenas em desenvolvimento)
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  window.portfolio = portfolio;
  window.CONFIG = CONFIG;
}

// Service Worker para PWA (opcional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registrado'))
    //   .catch(error => console.log('SW falhou'));
  });
}

// Tratamento de erros globais
window.addEventListener("error", (event) => {
  console.error("Erro global capturado:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Promise rejeitada:", event.reason);
});

// ==========================================================================
// EASTER EGGS E DETALHES ESPECIAIS
// ==========================================================================

// Konami Code
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;

document.addEventListener("keydown", (e) => {
  if (e.keyCode === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      // Easter egg ativado!
      document.body.style.transform = "rotate(1turn)";
      document.body.style.transition = "transform 2s ease-in-out";

      setTimeout(() => {
        document.body.style.transform = "";
      }, 2000);

      konamiIndex = 0;
      console.log("🎉 Konami Code ativado!");
    }
  } else {
    konamiIndex = 0;
  }
});

// Console art
console.log(
  `
%c
    ╔══════════════════════════════════════════════╗
    ║                                              ║
    ║            🚀 LÊNIN PORTFOLIO 🚀             ║
    ║                                              ║
    ║         Desenvolvido com ❤️ e ☕            ║
    ║                                              ║
    ║    Frontend: React, TypeScript, Next.js     ║
    ║    Backend: Node.js, PostgreSQL, MongoDB    ║
    ║                                              ║
    ║         Quer trabalhar comigo? 👨‍💻          ║
    ║      https://linkedin.com/in/lenin-dev       ║
    ║                                              ║
    ╚══════════════════════════════════════════════╝

`,
  "color: #00d8ff; font-family: monospace; font-size: 12px;"
);

console.log(
  "%c🔍 Psst... Tente o Konami Code!",
  "color: #ff6b6b; font-weight: bold;"
);
