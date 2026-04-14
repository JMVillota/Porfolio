import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.room.children.forEach((child) => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child;
            }
        });
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;

        GSAP.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.overflow = "visible";

        if (
            !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            this.setSmoothScroll();
        }
        this.setScrollTrigger();
        this.setUiScrollAnimations();
    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            ease: 0.18,
            disableRaf: true,
        });

        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement,
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            fixedMarkers: true,
        });

        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(
                    ".gsap-marker-start, .gsap-marker-end, [asscroll]"
                ),
            });
        });
        return asscroll;
    }

    setSmoothScroll() {
        this.asscroll = this.setupASScroll();
    }

    setScrollTrigger() {
        ScrollTrigger.matchMedia({
            //Desktop
            "(min-width: 969px)": () => {
                // console.log("fired desktop");

                this.room.scale.set(0.11, 0.11, 0.11);
                this.rectLight.width = 0.5;
                this.rectLight.height = 0.7;
                this.rectLight.intensity = 2.2;
                this.camera.orthographicCamera.position.set(0, 6.5, 10);
                this.room.position.set(0, 0, 0);
                // First section -----------------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.25,
                        // markers: true,
                        invalidateOnRefresh: true,
                    },
                });
                this.firstMoveTimeline.fromTo(
                    this.room.position,
                    { x: 0, y: 0, z: 0 },
                    {
                        x: () => {
                            return this.sizes.width * 0.0014;
                        },
                    }
                );

                // Second section -----------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.25,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(
                        this.room.position,
                        {
                            x: () => {
                                return 1;
                            },
                            z: () => {
                                return this.sizes.height * 0.0032;
                            },
                        },
                        "same"
                    )
                    .to(
                        this.room.scale,
                        {
                            x: 0.4,
                            y: 0.4,
                            z: 0.4,
                        },
                        "same"
                    )
                    .to(
                        this.rectLight,
                        {
                            width: 0.5 * 4,
                            height: 0.7 * 4,
                            intensity: 3.8,
                        },
                        "same"
                    );

                // Third section -----------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.25,
                        invalidateOnRefresh: true,
                    },
                }).to(this.camera.orthographicCamera.position, {
                    y: 1.5,
                    x: -4.1,
                });
            },

            // Mobile
            "(max-width: 968px)": () => {
                // console.log("fired mobile");

                // Resets
                this.room.scale.set(0.07, 0.07, 0.07);
                this.room.position.set(0, 0, 0);
                this.rectLight.width = 0.3;
                this.rectLight.height = 0.4;
                this.rectLight.intensity = 2.1;
                this.camera.orthographicCamera.position.set(0, 6.5, 10);

                // First section -----------------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.25,
                        // invalidateOnRefresh: true,
                    },
                }).to(this.room.scale, {
                    x: 0.1,
                    y: 0.1,
                    z: 0.1,
                });

                // Second section -----------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.25,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(
                        this.room.scale,
                        {
                            x: 0.25,
                            y: 0.25,
                            z: 0.25,
                        },
                        "same"
                    )
                    .to(
                        this.rectLight,
                        {
                            width: 0.3 * 3.4,
                            height: 0.4 * 3.4,
                            intensity: 3.2,
                        },
                        "same"
                    )
                    .to(
                        this.room.position,
                        {
                            x: 1.5,
                        },
                        "same"
                    );

                // Third section -----------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.25,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.position, {
                    z: -4.5,
                });
            },

            // all
            all: () => {
                this.sections = document.querySelectorAll(".section");
                this.sections.forEach((section) => {
                    this.progressWrapper =
                        section.querySelector(".progress-wrapper");
                    this.progressBar = section.querySelector(".progress-bar");

                    if (section.classList.contains("right")) {
                        GSAP.to(section, {
                            borderTopLeftRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            },
                        });
                        GSAP.to(section, {
                            borderBottomLeftRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            },
                        });
                    } else {
                        GSAP.to(section, {
                            borderTopRightRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            },
                        });
                        GSAP.to(section, {
                            borderBottomRightRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            },
                        });
                    }
                    GSAP.from(this.progressBar, {
                        scaleY: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.2,
                            pin: this.progressWrapper,
                            pinSpacing: false,
                        },
                    });
                });

                // All animations
                // First section -----------------------------------------
                this.firstCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.circleFirst.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                // Second section -----------------------------------------
                this.secondCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                })
                    .to(
                        this.circleSecond.scale,
                        {
                            x: 3,
                            y: 3,
                            z: 3,
                        },
                        "same"
                    )
                    .to(
                        this.room.position,
                        {
                            y: 0.7,
                        },
                        "same"
                    );

                // Third section -----------------------------------------
                this.thirdCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.circleThird.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                // Mini Platform Animations
                this.secondPartTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top center",
                        end: "bottom center",
                        scrub: 0.25,
                        invalidateOnRefresh: true,
                    },
                });

                this.room.children.forEach((child) => {
                    if (child.name === "Mini_Floor") {
                        this.first = GSAP.to(child.position, {
                            x: -5.44055,
                            z: 13.6135,
                            duration: 0.3,
                        });
                    }
                    if (child.name === "Mailbox") {
                        this.second = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            duration: 0.3,
                        });
                    }
                    if (child.name === "Lamp") {
                        this.third = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "FloorFirst") {
                        this.fourth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "FloorSecond") {
                        this.fifth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            duration: 0.3,
                        });
                    }
                    if (child.name === "FloorThird") {
                        this.sixth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "Dirt") {
                        this.seventh = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "Flower1") {
                        this.eighth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if (child.name === "Flower2") {
                        this.ninth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                });
                this.secondPartTimeline.add(this.first);
                this.secondPartTimeline.add(this.second);
                this.secondPartTimeline.add(this.third);
                this.secondPartTimeline.add(this.fourth, "-=0.2");
                this.secondPartTimeline.add(this.fifth, "-=0.2");
                this.secondPartTimeline.add(this.sixth, "-=0.2");
                this.secondPartTimeline.add(this.seventh, "-=0.2");
                this.secondPartTimeline.add(this.eighth);
                this.secondPartTimeline.add(this.ninth, "-=0.1");
            },
        });
    }

    setUiScrollAnimations() {
        GSAP.timeline({
            scrollTrigger: {
                trigger: ".page-wrapper",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.35,
                invalidateOnRefresh: true,
            },
        })
            .to(
                ".scroll-grid",
                {
                    backgroundPositionX: "120px",
                    backgroundPositionY: "260px",
                    ease: "none",
                },
                0
            )
            .to(
                ".scroll-glow",
                {
                    xPercent: -12,
                    yPercent: 18,
                    opacity: 0.95,
                    ease: "none",
                },
                0
            )
            .to(
                ".scroll-atmosphere",
                {
                    "--line-opacity": 1,
                    ease: "none",
                },
                0
            )
            .to(
                ".flash-a",
                {
                    xPercent: 24,
                    yPercent: 12,
                    opacity: 0.42,
                    scale: 1.16,
                    ease: "none",
                },
                0
            )
            .to(
                ".flash-b",
                {
                    xPercent: -20,
                    yPercent: 8,
                    opacity: 0.5,
                    scale: 1.22,
                    ease: "none",
                },
                0
            )
            .to(
                ".flash-c",
                {
                    yPercent: -16,
                    opacity: 0.44,
                    scale: 1.2,
                    ease: "none",
                },
                0
            );

        GSAP.utils.toArray(".scroll-line").forEach((line, index) => {
            GSAP.to(line, {
                yPercent: 85 + index * 12,
                xPercent: index % 2 === 0 ? 14 : -14,
                rotate: index % 2 === 0 ? 12 : -12,
                ease: "none",
                scrollTrigger: {
                    trigger: ".page-wrapper",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.25,
                    invalidateOnRefresh: true,
                },
            });
        });

        // Keep hero subtitle always visible to avoid flicker/disappearance.
        GSAP.set(".hero-second-subheading", { y: 0, opacity: 1 });

        GSAP.utils.toArray(".section-heading").forEach((element) => {
            GSAP.set(element, { y: 0, opacity: 1 });

            ScrollTrigger.create({
                trigger: element,
                start: "top 88%",
                once: true,
                onEnter: () => {
                    GSAP.from(element, {
                        y: 20,
                        opacity: 0,
                        duration: 0.65,
                        ease: "power3.out",
                        clearProps: "transform,opacity",
                    });
                },
            });
        });

        GSAP.utils.toArray(".section-title-text").forEach((element) => {
            GSAP.set(element, { y: 0, opacity: 1 });

            ScrollTrigger.create({
                trigger: element,
                start: "top 88%",
                once: true,
                onEnter: () => {
                    GSAP.from(element, {
                        y: 24,
                        opacity: 0,
                        duration: 0.7,
                        ease: "power3.out",
                        clearProps: "transform,opacity",
                    });
                },
            });
        });

        GSAP.utils.toArray(".section-text").forEach((element) => {
            GSAP.set(element, { y: 0, opacity: 1 });

            ScrollTrigger.create({
                trigger: element,
                start: "top 90%",
                once: true,
                onEnter: () => {
                    GSAP.from(element, {
                        y: 18,
                        opacity: 0,
                        duration: 0.7,
                        ease: "power2.out",
                        clearProps: "transform,opacity",
                    });
                },
            });
        });

        [".first-move", ".second-move", ".third-move"].forEach((trigger) => {
            ScrollTrigger.create({
                trigger,
                start: "top center",
                onEnter: () => this.playFlashPulse(),
                onLeaveBack: () => this.playFlashPulse(),
            });
        });
    }

    playFlashPulse() {
        GSAP.timeline()
            .to(
                [".flash-a", ".flash-b", ".flash-c"],
                {
                    opacity: 0.7,
                    scale: 1.36,
                    duration: 0.24,
                    stagger: 0.05,
                    ease: "power2.out",
                },
                0
            )
            .to(
                ".scroll-glow",
                {
                    opacity: 1,
                    duration: 0.24,
                    ease: "power2.out",
                },
                0
            )
            .to(
                [".flash-a", ".flash-b", ".flash-c"],
                {
                    opacity: 0.28,
                    scale: 1,
                    duration: 0.55,
                    stagger: 0.04,
                    ease: "power1.inOut",
                },
                0.2
            )
            .to(
                ".scroll-glow",
                {
                    opacity: 0.82,
                    duration: 0.55,
                    ease: "power1.inOut",
                },
                0.2
            );

        if (this.rectLight) {
            GSAP.fromTo(
                this.rectLight,
                { intensity: this.rectLight.intensity },
                {
                    intensity: this.rectLight.intensity + 1.25,
                    duration: 0.22,
                    yoyo: true,
                    repeat: 1,
                    ease: "sine.inOut",
                }
            );
        }
    }
    resize() {}

    update() {}
}
