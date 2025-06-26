
       PROGRAM ORBITKI
       IMPLICIT REAL*8 (A-H,O-Z)
       INTEGER :: TN, NPA, J
       CHARACTER*200 CMDARG
       DIMENSION E(6),X(6),F(6),B(6),R(13,6)
       EXTERNAL STIN

       CALL CPU_TIME(T1)

       PI=DACOS(-1.D0)
       XMU=1.D0

       TN=1
       NPA=1

       CALL GET_COMMAND_ARGUMENT(1, CMDARG)
       READ(CMDARG, *) (E(J),J=1,6), REV

       CALL CCIUEO(E,1)
       CALL ELEVAP(E,X)

       N=6
       HMIN=1.D-5
       HMAX=1.D0
       TOLRK=1.D-14
       H=1.D-1
       T=0.D0

       RP=E(1)*(1-E(2))
       IF (RP.LT.1.0234375D0) THEN
       WRITE(*,*) 'ALTITUDE OF SATELLITE IS BELOW 150 KM'
       ENDIF

       PER=2.D0*PI*DSQRT(E(1)**3.D0/XMU)
       PER=REV*PER

       CALL CCIUEO(E,2)
       CALL PRINT_JSON(TN,E,X,T)

       DO WHILE (T .LT. PER)
       CALL RK78(T,X,N,H,HMIN,HMAX,TOLRK,R,B,F,STIN)
       TN = TN + 1
       CALL VAPELE(E,X)
       CALL CCIUEO(E,2)
       CALL PRINT_JSON(TN,E,X,T)
       END DO


       CALL CPU_TIME(T2)
       WRITE(*,*) 'TEMPS: ', T2-T1
       END

      SUBROUTINE PRINT_JSON(TN, E, X, T)
      IMPLICIT NONE
      INTEGER :: TN, J
      REAL*8 :: E(6), X(6), T

      WRITE(*,'(A)', ADVANCE='NO') '{"tn":'
      WRITE(*,'(I0)', ADVANCE='NO') TN
      WRITE(*,'(A)', ADVANCE='NO') ',"elements":['
      DO J = 1,6
         WRITE(*,'(ES20.12)', ADVANCE='NO') E(J)
         IF (J < 6) WRITE(*,'(A)', ADVANCE='NO') ','
      ENDDO
      WRITE(*,'(A)', ADVANCE='NO') '],"state":['
      DO J = 1,6
         WRITE(*,'(ES20.12)', ADVANCE='NO') X(J)
         IF (J < 6) WRITE(*,'(A)', ADVANCE='NO') ','
      ENDDO
      WRITE(*,'(A,ES20.12,A)') '],"t":', T, '}'

      RETURN
      END




       SUBROUTINE STIN(T,X,N,F)
C**********************************************************************
C Camp vectorial equacions inercials satel.lit sin J2
C Si N=6 Equacions per pos+vel (x,y,z,xd,yd,zd) inercial. (Unit adim)
C Si N=42 Equacions + les seves variacionals per columnes.
C**********************************************************************
C     Calcula el primer término de la ecuación diferencial (órbita sin perturbación)
        IMPLICIT REAL*8 (A-H,O-Z)
C Posar els parametres iguals a totes les rutines que els tinguin !!
        PARAMETER (XMU=1.D0,RE=1.D0)
        DIMENSION X(*),F(*)
        F(1)=X(4)
        F(2)=X(5)
        F(3)=X(6)
        P1=DSQRT((X(1)*X(1))+(X(2)*X(2))+(X(3)*X(3)))
        P2=1.D0/(P1**3.D0)
        F(4)=-X(1)*XMU*P2
        F(5)=-X(2)*XMU*P2
        F(6)=-X(3)*XMU*P2
        RETURN
        END




       SUBROUTINE CCIUEO(E,ICIS)
C**********************************************************************
C THIS SUBROUTINE CHANGES THE UNITS OF ORBITAL ELEMENTS:
C ICIS= 1, KM, DEGREES CHANGE TO UNIT ADM,RAD
C       2, UNIT ADM,RAD CHANGE TO KM, DEGREES
C**********************************************************************
       IMPLICIT REAL*8 (A-H,O-Z)
       DIMENSION E(6)

       PI=DACOS(-1.D0)

       IF (ICIS.EQ.1) THEN
       E(1)=E(1)/6400.D0
       E(2)=E(2)
       E(3)=(E(3)*PI)/180.D0
       E(4)=(E(4)*PI)/180.D0
       E(5)=(E(5)*PI)/180.D0
       E(6)=(E(6)*PI)/180.D0

       ELSE
       E(1)=E(1)*6400.D0
       E(2)=E(2)
       E(3)=(E(3)*180.D0)/PI
       E(4)=(E(4)*180.D0)/PI
       E(5)=(E(5)*180.D0)/PI
       E(6)=(E(6)*180.D0)/PI

       ENDIF

       RETURN
       END





      SUBROUTINE ELEVAP (E,S)
C---------------------------------------------------------
C  FROM ORBITAL ELEMENTS TO POSITION AND VELOCITY
C  XMU=GRAVITY POTENTIAL OF CENTRAL BODY
C   UNITS:
C  DISTANCE..UA, TIME..TU (1TU=13.44..MIN=806.811..SEC)
C  E(1)=SEMI-MAJOR AXIS
C  E(2)=ECCENTRICITY
C  E(3)=INCLINATION
C  E(4)=ASCENDING NODE
C  E(5)=ARGUMENT OF PERIGEE
C  E(6)=TRUE ANOMALY
C  S(1)......S(6)= VECTORS, POSITION AND VELOCITY
C--------------------------------------------------------
      IMPLICIT REAL*8 (A-H,O-Z)
      DIMENSION S(6), E(6)

      XMU=1.D0
      P=E(1)*(1.D0-E(2)**2)
      F=DSQRT(DABS(XMU/P))
      R=P/(1.D0+E(2)*DCOS(E(6)))
      U=E(5)+E(6)

      CU=DCOS(U)
      SU=DSIN(U)
      CO=DCOS(E(4))
      SO=DSIN(E(4))
      CI=DCOS(E(3))
      SI=DSIN(E(3))

      COCU=CO*CU
      SOSU=SO*SU
      SOCU=SO*CU
      COSU=CO*SU

      FX=COCU-SOSU*CI
      FY=SOCU+COSU*CI
      FZ=SU*SI

      VR=F*E(2)*DSIN(E(6))
      VU=F*(1.D0+E(2)*DCOS(E(6)))

      S(1)=R*FX
      S(2)=R*FY
      S(3)=R*FZ
      S(4)=VR*FX-VU*(COSU+SOCU*CI)
      S(5)=VR*FY-VU*(SOSU-COCU*CI)
      S(6)=VR*FZ+VU*CU*SI

      RETURN
      END



      SUBROUTINE VAPELE (E,S)
C----------------------------------------------------
C  FROM POSITION AN VELOCITY TO KEPLERIAN ELEMENTS
C  E(1)=SEMI-MAJOR AXIS
C  E(2)=ECCENTRICITY
C  E(3)=INCLINATION
C  E(4)=ASCENDING NODE
C  E(5)=ARGUMENT OF PERIGEE
C  E(6)=TRUE ANOMALY
C  S(1)......S(6)= VECTORS, POSITION ANDVELOCITY
C  H=ANGULAR MOMENTUM
C----------------------------------------------------
      IMPLICIT REAL*8 (A-H,O-Z)
      DIMENSION S(6),E(6)

      PI=DACOS(-1.D0)

      XMU=1.D0

      R=DSQRT(S(1)**2+S(2)**2+S(3)**2)
      V=DSQRT(S(4)**2+S(5)**2+S(6)**2)

      HX=S(2)*S(6)-S(3)*S(5)
      HY=S(3)*S(4)-S(1)*S(6)
      HZ=S(1)*S(5)-S(2)*S(4)

      HH=DSQRT(HX**2+HY**2+HZ**2)

      PMA=-HY
      PMB=HX
      PMC=0
      PMP=DSQRT(PMA**2+PMB**2+PMC**2)

      VEA=(S(5)*HZ-S(6)*HY)/XMU-S(1)/R
      VEB=(S(6)*HX-S(4)*HZ)/XMU-S(2)/R
      VEC=(S(4)*HY-S(5)*HX)/XMU-S(3)/R
      VEE=DSQRT(VEA**2+VEB**2+VEC**2)

      E(1)=1/(2/R-V**2/XMU)
      E(2)=DSQRT(1.D0-(HH**2/(XMU*E(1))))


      E(3)=DATAN((DSQRT(HX**2+HY**2))/HZ)
      IF (E(3).LT.0) E(3)=PI+E(3)


      IF (PMB.GE.0.D0) THEN
      E(4)=DACOS(PMA/PMP)
      ELSE
      E(4)=(2*PI)-DACOS(PMA/PMP)
      ENDIF

      IF (VEC.GE.0.D0) THEN
      E(5)=DACOS((PMA*VEA+PMB*VEB+PMC*VEC)/(PMP*VEE))
      ELSE
      E(5)=2*PI-DACOS((PMA*VEA+PMB*VEB+PMC*VEC)/(PMP*VEE))
      ENDIF


      DR=(S(1)*S(4)+S(2)*S(5)+S(3)*S(6))/R

      IF (DR.GE.0.D0) THEN
      E(6)=DACOS((VEA*S(1)+VEB*S(2)+VEC*S(3))/(R*VEE))
      ELSE
      E(6)=2*PI-DACOS((VEA*S(1)+VEB*S(2)+VEC*S(3))/(R*VEE))
      ENDIF

      RETURN
      END




C********************************************************************
C
C  SUBROUTINE RK78
C
C  THIS ROUTINE IS AN IMPLEMENTATION OF A RUNGE-KUTTA-FEHLBERG
C  METHOD OF ORDERS 7 AND 8. USING A TOTAL OF 13 STEPS (AND
C  EVALUATIONS OF THE VECTORFIELD) IT COMPUTES TWO DIFFERENT
C  ESTIMATIONS OF THE NEXT POINT. THE DIFFERENCE BETWEEN BOTH
C  ESTIMATIONS (WITH LOCAL ERRORS OF ORDER 8 AND 9) IS COMPUTED
C  AND THE L1 NORM IS OBTAINED. THIS NORM IS DIVIDED BY N (THE
C  NUMBER OF EQUATIONS). THE NUMBER OBTAINED IN THIS WAY IS REQUIRED
C  TO BE LESS THAN A GIVEN TOLERANCE E1 TIMES (1+0.01*DD) WHERE DD
C  IS THE L1 NORM OF THE POINT COMPUTED TO ORDER 8. IF THIS
C  REQUIREMENT IS SATISFIED THE ORDER 8 ESTIMATION IS TAKEN AS THE
C  NEXT POINT. IF NOT, A SUITABLE VALUE OF THE STEP H IS OBTAINED
C  AND THE COMPUTATION IS STARTED AGAIN.
C  IN ANY CASE, WHEN THE NEXT POINT IS COMPUTED, A PREDICTION OF
C  THE STEP H, TO BE USED IN THE NEXT CALL OF THE ROUTINE, IS
C  DONE.
C
C  INPUT DATA:
C
C       X  CURRENT VALUE OF THE INDEPENDENT VARIABLE.
C    Y(i) i=1,N  THE CURRENT VALUE OF THE DEPENDENT VARIABLE.
C       N  THE DIMENSION OF THE DEPENDENT VARIABLE.
C       H  THE TIME STEP TO BE USED.
C     HMI  THE MINIMUM ALLOWED VALUE FOR THE ABSOLUTE VALUE OF H.
C    HMAX  THE MAXIMUM ALLOWED VALUE FOR THE ABSOLUTE VALUE OF H.
C      E1  A TOLERANCE.
C   DERIV  THE NAME OF THE ROUTINE COMPUTING THE VECTOR FIELD (TO
C          BE DECLARED EXTERNAL IN THE CALLING PROGRAM).
C
C  OUTPUT DATA:
C
C       X  THE NEXT VALUE OF THE INDEPENDENT VARIABLE.
C     Y(i) i=1,N  THE ESTIMATED NEXT VALUE FOR THE DEPENDENT
C          VARIABLE.
C       H  THE TIME STEP TO BE USED IN THE NEXT CALL OF THIS
C          ROUTINE.
C
C  AUXILIARY PARAMETERS:
C
C  R,B,F   A MATRIX OF DIMENSION (13,N), AND TWO VECTORS OF
C          DIMENSION N TO BE USED AS A WORKING SPACE.
C
C  ROUTINES USED: DERIV
C
C********************************************************************
       SUBROUTINE RK78 (X,Y,N,H,HMI,HMAX,E1,R,B,F,DERIV)
       DOUBLE PRECISION X,Y(N),H,E1,R(13,N),B(N),F(N),A,BET,
     &  ALFA(131),BETA(79),C(11),CP(13),D,DD,E3,E4,HMI,HMAX,FAC
         DATA II/0/
       SAVE II,ALFA,BETA,C,CP
       IF (II.NE.0) GOTO 12
       II=1
       ALFA(1)=0.D0
       ALFA(2)=2.D0/27.D0
       ALFA(3)=1.D0/9.D0
       ALFA(4)=1.D0/6.D0
       ALFA(5)=5.D0/12.D0
       ALFA(6)=.5D0
       ALFA(7)=5.D0/6.D0
       ALFA(8)=1.D0/6.D0
       ALFA(9)=2.D0/3.D0
       ALFA(10)=1.D0/3.D0
       ALFA(11)=1.D0
       ALFA(12)=0.D0
       ALFA(13)=1.D0
       BETA(1)=0.D0
       BETA(2)=2.D0/27.D0
       BETA(3)=1.D0/36.D0
       BETA(4)=1.D0/12.D0
       BETA(5)=1.D0/24.D0
       BETA(6)=0.D0
       BETA(7)=1.D0/8.D0
       BETA(8)=5.D0/12.D0
       BETA(9)=0.D0
       BETA(10)=-25.D0/16.D0
       BETA(11)=-BETA(10)
       BETA(12)=.5D-1
       BETA(13)=0.D0
       BETA(14)=0.D0
       BETA(15)=.25D0
       BETA(16)=.2D0
       BETA(17)=-25.D0/108.D0
       BETA(18)=0.D0
       BETA(19)=0.D0
       BETA(20)=125.D0/108.D0
       BETA(21)=-65.D0/27.D0
       BETA(22)=2.D0*BETA(20)
       BETA(23)=31.D0/300.D0
       BETA(24)=0.D0
       BETA(25)=0.D0
       BETA(26)=0.D0
       BETA(27)=61.D0/225.D0
       BETA(28)=-2.D0/9.D0
       BETA(29)=13.D0/900.D0
       BETA(30)=2.D0
       BETA(31)=0.D0
       BETA(32)=0.D0
       BETA(33)=-53.D0/6.D0
       BETA(34)=704.D0/45.D0
       BETA(35)=-107.D0/9.D0
       BETA(36)=67.D0/90.D0
       BETA(37)=3.D0
       BETA(38)=-91.D0/108.D0
       BETA(39)=0.D0
       BETA(40)=0.D0
       BETA(41)=23.D0/108.D0
       BETA(42)=-976.D0/135.D0
       BETA(43)=311.D0/54.D0
       BETA(44)=-19.D0/60.D0
       BETA(45)=17.D0/6.D0
       BETA(46)=-1.D0/12.D0
       BETA(47)=2383.D0/4100.D0
       BETA(48)=0.D0
       BETA(49)=0.D0
       BETA(50)=-341.D0/164.D0
       BETA(51)=4496.D0/1025.D0
       BETA(52)=-301.D0/82.D0
       BETA(53)=2133.D0/4100.D0
       BETA(54)=45.D0/82.D0
       BETA(55)=45.D0/164.D0
       BETA(56)=18.D0/41.D0
       BETA(57)=3.D0/205.D0
       BETA(58)=0.D0
       BETA(59)=0.D0
       BETA(60)=0.D0
       BETA(61)=0.D0
       BETA(62)=-6.D0/41.D0
       BETA(63)=-3.D0/205.D0
       BETA(64)=-3.D0/41.D0
       BETA(65)=-BETA(64)
       BETA(66)=-BETA(62)
       BETA(67)=0.D0
       BETA(68)=-1777.D0/4100.D0
       BETA(69)=0.D0
       BETA(70)=0.D0
       BETA(71)=BETA(50)
       BETA(72)=BETA(51)
       BETA(73)=-289.D0/82.D0
       BETA(74)=2193.D0/4100.D0
       BETA(75)=51.D0/82.D0
       BETA(76)=33.D0/164.D0
       BETA(77)=12.D0/41.D0
       BETA(78)=0.D0
       BETA(79)=1.D0
       C(1)=41.D0/840.D0
       C(2)=0.D0
       C(3)=0.D0
       C(4)=0.D0
       C(5)=0.D0
       C(6)=34.D0/105.D0
       C(7)=9.D0/35.D0
       C(8)=C(7)
       C(9)=9.D0/280.D0
       C(10)=C(9)
       C(11)=C(1)
       CP(1)=0.D0
       CP(2)=0.D0
       CP(3)=0.D0
       CP(4)=0.D0
       CP(5)=0.D0
       CP(6)=C(6)
       CP(7)=C(7)
       CP(8)=C(8)
       CP(9)=C(9)
       CP(10)=C(10)
       CP(11)=0.D0
       CP(12)=C(1)
       CP(13)=C(1)
  9    CONTINUE
12    JK=1
       DO 3 J=1,13
       DO 6 L=1,N
    6  B(L)=Y(L)
       A=X+ALFA(J)*H
       IF(J.EQ.1)GO TO 13
       J1=J-1
       DO 4 K=1,J1,1
       JK=JK+1
       BET=BETA(JK)*H
       DO 4 L=1,N
    4  B(L)=B(L)+BET*R(K,L)
   13  CONTINUE
        CALL DERIV (A,B,N,F)
       DO 3 L=1,N
    3  R(J,L)=F(L)
       D=0
       DD=0
       DO 1 L=1,N
       B(L)=Y(L)
       F(L)=Y(L)
       DO 5 K=1,11
       BET=H*R(K,L)
       B(L)=B(L)+BET*C(K)
    5  F(L)=F(L)+BET*CP(K)
       F(L)=F(L)+H*(CP(12)*R(12,L)+CP(13)*R(13,L))
       D=D+DABS(F(L)-B(L))
  1    DD=DD+DABS(F(L))
         D=D/N
         FAC=1.+DD*1.D-2
       E3=E1*FAC
       IF (DABS(H).LT.HMI.OR.D.LT.E3) GO TO 7
         H=H*0.9D0*(E3/D)**0.125D0
         IF(DABS(H).LT.HMI)H=HMI*H/DABS(H)
       GOTO 9
  7    X=X+H
         IF(D.LT.E3)D=DMAX1(D,E3/256)
         H=H*0.9D0*(E3/D)**0.125D0
         IF(DABS(H).GT.HMAX)H=HMAX*H/DABS(H)
         IF(DABS(H).LT.HMI)H=HMI*H/DABS(H)
11    DO 10 L=1,N
10    Y(L)=F(L)
       B(1)=D

       RETURN
       END

