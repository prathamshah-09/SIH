/** @type {import('tailwindcss').Config} */
import animate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
        "2xl": "1.25rem",
        "3xl": "1.5rem",
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
        "sky-soft": "hsl(var(--sky-soft))",
        "sky-light": "hsl(var(--sky-light))",
        "ocean-deep": "hsl(var(--ocean-deep))",
        "ocean-glow": "hsl(var(--ocean-glow))",
        "cyan-bright": "hsl(var(--cyan-bright))",
        "cyan-light": "hsl(var(--cyan-light))",
        "azure-mist": "hsl(var(--azure-mist))",
        "lavender-hint": "hsl(var(--lavender-hint))",
        "seafoam": "hsl(var(--seafoam))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        "fade-up": "fade-up 0.8s ease-out forwards",
        marquee: "marquee 50s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
  		},
      backgroundImage: {
        "gradient-calm": "linear-gradient(135deg, hsl(205 85% 55% / 0.08), hsl(195 80% 60% / 0.12))",
        "gradient-hero": "linear-gradient(180deg, hsl(215 40% 12% / 0.3) 0%, hsl(205 50% 20% / 0.6) 50%, hsl(200 40% 15% / 0.8) 100%)",
        "gradient-ocean": "linear-gradient(135deg, hsl(205 85% 55%) 0%, hsl(195 80% 60%) 50%, hsl(185 70% 55%) 100%)",
        "gradient-section": "linear-gradient(180deg, hsl(210 40% 98%) 0%, hsl(200 50% 96%) 100%)",
        "gradient-radial-blue": "radial-gradient(ellipse at top, hsl(200 70% 90%) 0%, hsl(210 40% 98%) 70%)",
      },
      boxShadow: {
        "soft": "0 4px 25px -6px hsl(205 85% 55% / 0.2)",
        "card": "0 10px 40px -10px hsl(215 30% 30% / 0.12)",
        "glow": "0 0 50px hsl(195 80% 60% / 0.35)",
        "button": "0 4px 15px -3px hsl(205 85% 55% / 0.4)",
      },
  	}
  },
  plugins: [animate],
};